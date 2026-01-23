// pages/api/applications/create.js
import formidable from "formidable";
import { db, FieldValue, storage } from "@/libs/firebase/admin";
import {
    buildApplicantThanksEmailHtml,
    buildEmployerApplicationEmailHtml,
    sendBewerbungEmail,
} from "@/libs/bewerbung/email";

export const config = {
    api: { bodyParser: false },
};

const MAX_MB = 15;
const MAX_BYTES = MAX_MB * 1024 * 1024;
const SIGNED_URL_DAYS = 5;

// ------------------------------------------------------------
// Helpers
// ------------------------------------------------------------
function asArray(v) {
    if (!v) return [];
    return Array.isArray(v) ? v : [v];
}

function reqStr(fields, key) {
    const v = fields?.[key];
    const s = Array.isArray(v) ? v[0] : v;
    if (!s || typeof s !== "string" || !s.trim()) {
        throw new Error(`Missing field: ${key}`);
    }
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

async function saveFile({ bucket, file, destPath }) {
    const gcsFile = bucket.file(destPath);

    const fs = await import("fs");
    const buffer = await fs.promises.readFile(file.filepath);

    await gcsFile.save(buffer, {
        contentType: "application/pdf",
        resumable: false,
        metadata: {
            cacheControl: "private, max-age=0, no-store",
        },
    });

    return {
        path: destPath,
        name: safeName(file.originalFilename),
    };
}

async function createSignedUrl(bucket, path) {
    const file = bucket.file(path);
    const [url] = await file.getSignedUrl({
        action: "read",
        expires: Date.now() + SIGNED_URL_DAYS * 24 * 60 * 60 * 1000,
    });
    return url;
}

// ------------------------------------------------------------
// Handler
// ------------------------------------------------------------
export default async function handler(req, res) {
    if (req.method !== "POST") {
        return res.status(405).json({ ok: false });
    }

    try {
        const form = formidable({
            multiples: true,
            maxFileSize: MAX_BYTES,
        });

        const { fields, files } = await new Promise((resolve, reject) => {
            form.parse(req, (err, f, fl) => {
                if (err) reject(err);
                else resolve({ fields: f, files: fl });
            });
        });

        // ------------------------------------------------------------
        // Required fields
        // ------------------------------------------------------------
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

        // ------------------------------------------------------------
        // Files
        // ------------------------------------------------------------
        const cvFile = asArray(files?.cv)[0];
        const coverFile = asArray(files?.coverLetter)[0] || null;
        const attachmentFiles = asArray(files?.attachments);

        if (!cvFile) {
            return res.status(400).json({ ok: false, error: "CV_REQUIRED" });
        }

        const allFiles = [cvFile, coverFile, ...attachmentFiles].filter(Boolean);
        for (const f of allFiles) {
            if (f.size > MAX_BYTES) {
                return res.status(400).json({ ok: false, error: "FILE_TOO_LARGE" });
            }
            if (f.mimetype && f.mimetype !== "application/pdf") {
                return res.status(400).json({ ok: false, error: "PDF_ONLY" });
            }
        }

        // ------------------------------------------------------------
        // 1) Firestore (ohne URLs!)
        // ------------------------------------------------------------
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

        // ------------------------------------------------------------
        // 2) Uploads → Storage (nur Pfade speichern)
        // ------------------------------------------------------------
        const bucket = storage.bucket();
        const prefix = `bewerbungen/${id}`;
        const mailFiles = [];

        // CV
        const cv = await saveFile({
            bucket,
            file: cvFile,
            destPath: `${prefix}/cv-${safeName(cvFile.originalFilename)}`,
        });
        await docRef.set({ uploads: { cv }, updatedAt: FieldValue.serverTimestamp() }, { merge: true });
        mailFiles.push({ label: "Lebenslauf", ...cv });

        // Cover Letter (optional)
        if (coverFile) {
            const cover = await saveFile({
                bucket,
                file: coverFile,
                destPath: `${prefix}/cover-${safeName(coverFile.originalFilename)}`,
            });
            await docRef.set(
                { uploads: { coverLetter: cover }, updatedAt: FieldValue.serverTimestamp() },
                { merge: true },
            );
            mailFiles.push({ label: "Motivationsschreiben", ...cover });
        }

        // Attachments
        const attachmentsOut = [];
        for (let i = 0; i < attachmentFiles.length; i++) {
            const f = attachmentFiles[i];
            if (!f) continue;

            const att = await saveFile({
                bucket,
                file: f,
                destPath: `${prefix}/attachment-${i + 1}-${safeName(f.originalFilename)}`,
            });

            attachmentsOut.push(att);
            mailFiles.push({ label: `Anhang ${i + 1}`, ...att });
        }

        if (attachmentsOut.length) {
            await docRef.set(
                { uploads: { attachments: attachmentsOut }, updatedAt: FieldValue.serverTimestamp() },
                { merge: true },
            );
        }

        // ------------------------------------------------------------
        // 3) Signed URLs NUR für Mail erzeugen (5 Tage)
        // ------------------------------------------------------------
        const fileLinks = [];
        for (const f of mailFiles) {
            const url = await createSignedUrl(bucket, f.path);
            fileLinks.push({ label: f.label, name: f.name, url });
        }

        // ------------------------------------------------------------
        // 4) Mails
        // ------------------------------------------------------------
        // LIVE Empfänger kommt aus email.js via category routing:
        // - DEV_MODE=true => alles an DEV_EMAIL_OVERRIDE
        // - DEV_MODE=false => Bewerbung an BEWERBUNG_TO_LIVE
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

        // Arbeitgeber-Mail (Kategorie: bewerbung)
        await sendBewerbungEmail({
            category: "bewerbung",
            // "to" ist optional, category routing nimmt BEWERBUNG_TO_LIVE (oder DEV override)
            to: process.env.BEWERBUNG_TO_LIVE || process.env.BEWERBUNG_TO || "",
            subject: `Neue Bewerbung: ${jobTitle} – ${lastName} ${firstName} (${id})`,
            html: buildEmployerApplicationEmailHtml(payload, { id, fileLinks, expiresDays: SIGNED_URL_DAYS }),
            replyTo: email,
        });

        // Bewerber-Mail (Kategorie: custom, aber DEV override greift ebenfalls)
        await sendBewerbungEmail({
            category: "custom",
            to: email,
            subject: `Vielen Dank für Ihre Bewerbung – ${jobTitle}`,
            html: buildApplicantThanksEmailHtml({ firstName, lastName, jobTitle }),
        });

        return res.status(200).json({ ok: true, id });
    } catch (e) {
        console.error("APPLICATION API ERROR:", e);
        return res.status(400).json({ ok: false, error: "BAD_REQUEST" });
    }
}
