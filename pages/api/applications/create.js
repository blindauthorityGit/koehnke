// pages/api/applications/create.js
import formidable from "formidable";
import { db, FieldValue, storage } from "@/libs/firebase/admin";
import {
    buildApplicantThanksEmailHtml,
    buildEmployerApplicationEmailHtml,
    sendBewerbungEmail,
} from "@/libs/bewerbung/email";

export const config = {
    api: { bodyParser: false }, // multipart/form-data
};

const MAX_MB = 15;
const MAX_BYTES = MAX_MB * 1024 * 1024;

function asArray(v) {
    if (!v) return [];
    return Array.isArray(v) ? v : [v];
}

function reqStr(fields, key) {
    const v = fields?.[key];
    const s = Array.isArray(v) ? v[0] : v;
    if (!s || typeof s !== "string" || !s.trim()) throw new Error(`Missing field: ${key}`);
    return s.trim();
}

function optStr(fields, key) {
    const v = fields?.[key];
    const s = Array.isArray(v) ? v[0] : v;
    return typeof s === "string" ? s.trim() : "";
}

function boolVal(fields, key) {
    const v = optStr(fields, key);
    return v === "true" || v === "1";
}

function safeName(name) {
    return String(name || "file.pdf")
        .replace(/[^\w.\-()+\s]/g, "_")
        .replace(/\s+/g, " ")
        .trim();
}

async function saveFileToBucket({ bucket, file, destPath }) {
    const gcsFile = bucket.file(destPath);

    // formidable v2/v3: filepath / mimetype / originalFilename / size
    await gcsFile.save(await import("fs").then((fs) => fs.promises.readFile(file.filepath)), {
        contentType: "application/pdf",
        resumable: false,
        metadata: {
            cacheControl: "private, max-age=0, no-store",
        },
    });

    const [url] = await gcsFile.getSignedUrl({
        action: "read",
        expires: Date.now() + 30 * 24 * 60 * 60 * 1000, // 30 Tage
    });

    return url;
}

export default async function handler(req, res) {
    if (req.method !== "POST") return res.status(405).json({ ok: false });

    try {
        const form = formidable({
            multiples: true,
            maxFileSize: MAX_BYTES,
        });

        const { fields, files } = await new Promise((resolve, reject) => {
            form.parse(req, (err, fieldsParsed, filesParsed) => {
                if (err) return reject(err);
                resolve({ fields: fieldsParsed, files: filesParsed });
            });
        });

        // ---- Felder (vom Frontend FormData)
        const jobPostingId = optStr(fields, "jobPostingId");
        const jobSlug = reqStr(fields, "jobSlug");
        const jobTitle = reqStr(fields, "jobTitle");

        const firstName = reqStr(fields, "firstName");
        const lastName = reqStr(fields, "lastName");
        const email = reqStr(fields, "email");
        const phone = reqStr(fields, "phone");
        const city = reqStr(fields, "city");

        const startASAP = boolVal(fields, "startASAP");
        const startDate = optStr(fields, "startDate");
        const employmentType = reqStr(fields, "employmentType");
        const hoursPerWeek = optStr(fields, "hoursPerWeek");
        const message = reqStr(fields, "message");
        const experience = optStr(fields, "experience");

        const privacyAccepted = boolVal(fields, "privacyAccepted");
        if (!privacyAccepted) {
            return res.status(400).json({ ok: false, error: "PRIVACY_NOT_ACCEPTED" });
        }

        const ref = optStr(fields, "ref");

        // ---- Files
        const cvFile = asArray(files?.cv)[0];
        const coverFile = asArray(files?.coverLetter)[0] || null;
        const attachmentFiles = asArray(files?.attachments);

        if (!cvFile) {
            return res.status(400).json({ ok: false, error: "CV_REQUIRED" });
        }

        // PDF-only / Size checks
        const all = [cvFile, coverFile, ...attachmentFiles].filter(Boolean);
        for (const f of all) {
            if (f.size > MAX_BYTES) {
                return res.status(400).json({ ok: false, error: "FILE_TOO_LARGE" });
            }
            if (f.mimetype && f.mimetype !== "application/pdf") {
                return res.status(400).json({ ok: false, error: "PDF_ONLY" });
            }
        }

        // ---- 1) Firestore create (ohne uploads)
        const baseDoc = {
            status: "submitted",
            createdAt: FieldValue.serverTimestamp(),
            updatedAt: FieldValue.serverTimestamp(),

            job: {
                jobPostingId: jobPostingId || null,
                jobSlug,
                jobTitle,
            },

            applicant: { firstName, lastName, email, phone, city },

            details: {
                startASAP,
                startDate: startASAP ? "" : startDate,
                employmentType,
                hoursPerWeek,
                message,
                experience,
            },

            meta: {
                ref: ref || null,
                userAgent: req.headers["user-agent"] || null,
            },

            uploads: {
                cv: null,
                coverLetter: null,
                attachments: [],
            },
        };

        const docRef = await db.collection("applications").add(baseDoc);
        const id = docRef.id;

        // ---- 2) Uploads in Storage
        const bucket = storage.bucket();
        const prefix = `bewerbungen/${id}`;

        const fileLinks = [];

        // CV
        {
            const name = safeName(cvFile.originalFilename || `lebenslauf-${id}.pdf`);
            const destPath = `${prefix}/cv-${name}`;
            const url = await saveFileToBucket({ bucket, file: cvFile, destPath });
            const item = { label: "Lebenslauf", name, url, path: destPath };
            fileLinks.push(item);

            await docRef.set({ uploads: { cv: item }, updatedAt: FieldValue.serverTimestamp() }, { merge: true });
        }

        // Cover letter optional
        if (coverFile) {
            const name = safeName(coverFile.originalFilename || `motivationsschreiben-${id}.pdf`);
            const destPath = `${prefix}/cover-${name}`;
            const url = await saveFileToBucket({ bucket, file: coverFile, destPath });
            const item = { label: "Motivationsschreiben", name, url, path: destPath };
            fileLinks.push(item);

            await docRef.set(
                { uploads: { coverLetter: item }, updatedAt: FieldValue.serverTimestamp() },
                { merge: true }
            );
        }

        // Attachments optional (multiple)
        const attOut = [];
        for (let i = 0; i < attachmentFiles.length; i++) {
            const f = attachmentFiles[i];
            if (!f) continue;

            const name = safeName(f.originalFilename || `anhang-${i + 1}-${id}.pdf`);
            const destPath = `${prefix}/attachment-${String(i + 1).padStart(2, "0")}-${name}`;
            const url = await saveFileToBucket({ bucket, file: f, destPath });

            const item = { label: `Anhang ${i + 1}`, name, url, path: destPath };
            attOut.push(item);
            fileLinks.push(item);
        }

        if (attOut.length) {
            await docRef.set(
                { uploads: { attachments: attOut }, updatedAt: FieldValue.serverTimestamp() },
                { merge: true }
            );
        }

        // ---- 3) Mails
        const employerTo = process.env.BEWERBUNG_TO;
        if (!employerTo) throw new Error("Missing BEWERBUNG_TO env var.");

        const payload = {
            jobPostingId,
            jobSlug,
            jobTitle,
            firstName,
            lastName,
            email,
            phone,
            city,
            startASAP,
            startDate,
            employmentType,
            hoursPerWeek,
            message,
            experience,
        };

        // Arbeitgeber-Mail (mit Reply-To = Bewerber)
        await sendBewerbungEmail({
            to: employerTo,
            subject: `Neue Bewerbung: ${jobTitle} – ${lastName} ${firstName} (${id})`,
            html: buildEmployerApplicationEmailHtml(payload, { id, fileLinks }),
            replyTo: email,
        });

        // Bewerber-Mail (Danke)
        await sendBewerbungEmail({
            to: email,
            subject: `Vielen Dank für Ihre Bewerbung – ${jobTitle}`,
            html: buildApplicantThanksEmailHtml({ firstName, lastName, jobTitle }),
        });

        return res.status(200).json({ ok: true, id });
    } catch (e) {
        console.error("APPLICATION API ERROR:", e?.message || e);
        return res.status(400).json({ ok: false, error: "BAD_REQUEST" });
    }
}
