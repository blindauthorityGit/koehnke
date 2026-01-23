// pages/api/appointments/request.js
import { db, FieldValue } from "@/libs/firebase/admin";
import { sendMail } from "@/libs/bewerbung/email";

const DAYS = new Set(["Mo", "Di", "Mi", "Do", "Fr"]);
const REASONS = new Set(["Kontrolle", "Prophylaxe", "Schmerzen / Notfall", "Beratung", "Ästhetik", "Sonstiges"]);
const TIMES = new Set(["Vormittag", "Nachmittag", "Egal"]);

function isEmail(str) {
    if (!str) return false;
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(str).trim());
}

function normalizeStr(v, max = 500) {
    return String(v ?? "")
        .trim()
        .slice(0, max);
}

function normalizePhone(v) {
    return normalizeStr(v, 40);
}

function validate(body) {
    const errors = {};

    const firstName = normalizeStr(body.firstName, 80);
    const lastName = normalizeStr(body.lastName, 80);
    const phone = normalizePhone(body.phone);
    const email = normalizeStr(body.email, 120);
    const reason = normalizeStr(body.reason, 80);
    const preferredTime = normalizeStr(body.preferredTime, 40);
    const message = normalizeStr(body.message, 2000);

    const preferredDays = Array.isArray(body.preferredDays)
        ? body.preferredDays.map((d) => normalizeStr(d, 2)).filter(Boolean)
        : [];

    const consentPrivacy = Boolean(body.consentPrivacy);
    const consentContact = Boolean(body.consentContact);

    // Honeypot
    const website = normalizeStr(body.website, 200);

    if (!firstName) errors.firstName = "Missing firstName";
    if (!lastName) errors.lastName = "Missing lastName";
    if (!phone || phone.length < 6) errors.phone = "Invalid phone";
    if (email && !isEmail(email)) errors.email = "Invalid email";
    if (!consentPrivacy) errors.consentPrivacy = "Missing consentPrivacy";
    if (!preferredDays.length) errors.preferredDays = "Missing preferredDays";

    if (reason && !REASONS.has(reason)) errors.reason = "Invalid reason";
    if (preferredTime && !TIMES.has(preferredTime)) errors.preferredTime = "Invalid preferredTime";
    if (preferredDays.some((d) => !DAYS.has(d))) errors.preferredDays = "Invalid preferredDays";

    return {
        ok: Object.keys(errors).length === 0,
        errors,
        cleaned: {
            firstName,
            lastName,
            phone,
            email: email || "",
            reason: reason && REASONS.has(reason) ? reason : "Kontrolle",
            preferredTime: preferredTime && TIMES.has(preferredTime) ? preferredTime : "Vormittag",
            preferredDays,
            message,
            consentPrivacy,
            consentContact,
            website,
        },
    };
}

function buildPracticeEmailText(data, firestoreId) {
    return [
        "Neue Terminanfrage",
        "",
        `Name: ${data.firstName} ${data.lastName}`,
        `Telefon: ${data.phone}`,
        `E-Mail: ${data.email || "-"}`,
        "",
        `Grund: ${data.reason}`,
        `Wunschtage: ${data.preferredDays.join(", ")}`,
        `Uhrzeit-Präferenz: ${data.preferredTime}`,
        "",
        `Nachricht:`,
        data.message ? data.message : "-",
        "",
        `Kontakt erlaubt: ${data.consentContact ? "Ja" : "Nein"}`,
        `Datenschutz akzeptiert: ${data.consentPrivacy ? "Ja" : "Nein"}`,
        "",
        `Firestore-ID: ${firestoreId}`,
    ].join("\n");
}

function buildPracticeEmailHtml(data, firestoreId) {
    const esc = (s) =>
        String(s ?? "")
            .replaceAll("&", "&amp;")
            .replaceAll("<", "&lt;")
            .replaceAll(">", "&gt;")
            .replaceAll('"', "&quot;");

    return `
  <div style="font-family:Arial,Helvetica,sans-serif; line-height:1.5; color:#0b1f3a;">
    <h2 style="margin:0 0 12px;">Neue Terminanfrage</h2>
    <table style="border-collapse:collapse; width:100%; max-width:700px;">
      <tr><td style="padding:6px 0; width:180px;"><b>Name</b></td><td style="padding:6px 0;">${esc(data.firstName)} ${esc(
          data.lastName,
      )}</td></tr>
      <tr><td style="padding:6px 0;"><b>Telefon</b></td><td style="padding:6px 0;">${esc(data.phone)}</td></tr>
      <tr><td style="padding:6px 0;"><b>E-Mail</b></td><td style="padding:6px 0;">${esc(data.email || "-")}</td></tr>
      <tr><td style="padding:6px 0;"><b>Grund</b></td><td style="padding:6px 0;">${esc(data.reason)}</td></tr>
      <tr><td style="padding:6px 0;"><b>Wunschtage</b></td><td style="padding:6px 0;">${esc(
          data.preferredDays.join(", "),
      )}</td></tr>
      <tr><td style="padding:6px 0;"><b>Uhrzeit</b></td><td style="padding:6px 0;">${esc(data.preferredTime)}</td></tr>
      <tr><td style="padding:10px 0; vertical-align:top;"><b>Nachricht</b></td><td style="padding:10px 0;">${
          data.message ? esc(data.message).replaceAll("\n", "<br/>") : "-"
      }</td></tr>
      <tr><td style="padding:6px 0;"><b>Kontakt erlaubt</b></td><td style="padding:6px 0;">${esc(
          data.consentContact ? "Ja" : "Nein",
      )}</td></tr>
    </table>

    <p style="margin:14px 0 0; font-size:12px; color:#425a75;">
      Firestore-ID: <b>${esc(firestoreId)}</b>
    </p>
    <p style="margin:10px 0 0; font-size:12px; color:#425a75;">
      Hinweis: Anfrage wurde über die Website gesendet und in Firestore gespeichert.
    </p>
  </div>`;
}

function buildCustomerEmailText(practiceName) {
    return [
        `Vielen Dank für Ihre Terminanfrage bei ${practiceName}.`,
        "",
        "Wir melden uns zeitnah zur Terminbestätigung.",
        "",
        "Mit freundlichen Grüßen",
        practiceName,
    ].join("\n");
}

function buildCustomerEmailHtml(practiceName) {
    const esc = (s) =>
        String(s ?? "")
            .replaceAll("&", "&amp;")
            .replaceAll("<", "&lt;")
            .replaceAll(">", "&gt;")
            .replaceAll('"', "&quot;");

    return `
  <div style="font-family:Arial,Helvetica,sans-serif; line-height:1.5; color:#0b1f3a;">
    <h2 style="margin:0 0 10px;">Vielen Dank für Ihre Terminanfrage</h2>
    <p style="margin:0 0 10px;">
      Vielen Dank für Ihre Anfrage bei <b>${esc(practiceName)}</b>.
      Wir melden uns zeitnah zur Terminbestätigung.
    </p>
    <p style="margin:0; font-size:12px; color:#425a75;">
      Bitte antworten Sie nicht auf diese automatische E-Mail.
    </p>
  </div>`;
}

export default async function handler(req, res) {
    if (req.method !== "POST") {
        res.setHeader("Allow", ["POST"]);
        return res.status(405).json({ message: "Method not allowed" });
    }

    const ip = (req.headers["x-forwarded-for"] || "").split(",")[0].trim() || req.socket?.remoteAddress || "unknown";
    const { ok, errors, cleaned } = validate(req.body || {});

    // Honeypot
    if (cleaned.website) {
        return res.status(200).json({ ok: true });
    }

    if (!ok) {
        return res.status(400).json({ message: "Validation failed", errors });
    }

    const practiceName = process.env.PRACTICE_NAME || "Zentrum für Zahnmedizin";
    const practiceEmailFallback = process.env.PRACTICE_INBOX_EMAIL; // fallback, falls CONTACT_TO_LIVE nicht gesetzt ist

    // Firestore Document
    const doc = {
        type: "appointmentRequest",
        status: "new",
        source: "website",
        createdAt: FieldValue.serverTimestamp(),

        meta: {
            ip,
            userAgent: req.headers["user-agent"] || "",
        },

        patient: {
            firstName: cleaned.firstName,
            lastName: cleaned.lastName,
            phone: cleaned.phone,
            email: cleaned.email || "",
        },

        request: {
            reason: cleaned.reason,
            preferredDays: cleaned.preferredDays,
            preferredTime: cleaned.preferredTime,
            message: cleaned.message,
            consentPrivacy: cleaned.consentPrivacy,
            consentContact: cleaned.consentContact,
        },
    };

    let docRef;
    try {
        docRef = await db.collection("appointmentRequests").add(doc);
    } catch (e) {
        return res.status(500).json({ message: "Failed to save request" });
    }

    // Emails
    const practiceSubject = `Neue Terminanfrage: ${cleaned.firstName} ${cleaned.lastName}`;
    const practiceText = buildPracticeEmailText(cleaned, docRef.id);
    const practiceHtml = buildPracticeEmailHtml(cleaned, docRef.id);

    const customerSubject = `Ihre Terminanfrage bei ${practiceName}`;
    const customerText = buildCustomerEmailText(practiceName);
    const customerHtml = buildCustomerEmailHtml(practiceName);

    try {
        // 1) Praxis-Mail (DEV override / LIVE = CONTACT_TO_LIVE)
        await sendMail({
            category: "appointment",
            to: process.env.CONTACT_TO_LIVE || practiceEmailFallback,
            replyTo: cleaned.email && isEmail(cleaned.email) ? cleaned.email : undefined,
            subject: practiceSubject,
            text: practiceText,
            html: practiceHtml,
        });

        // 2) Patient Bestätigung (nur wenn Email vorhanden)
        if (cleaned.email && isEmail(cleaned.email)) {
            await sendMail({
                category: "custom", // in DEV geht das ebenfalls an DEV override
                to: cleaned.email,
                subject: customerSubject,
                text: customerText,
                html: customerHtml,
            });
        }

        await docRef.update({
            status: "emailed",
            updatedAt: FieldValue.serverTimestamp(),
            email: {
                practiceNotified: true,
                customerNotified: Boolean(cleaned.email && isEmail(cleaned.email)),
                notifiedAt: FieldValue.serverTimestamp(),
            },
        });

        return res.status(200).json({ ok: true });
    } catch (e) {
        try {
            await docRef.update({
                status: "email_failed",
                updatedAt: FieldValue.serverTimestamp(),
                email: {
                    practiceNotified: false,
                    customerNotified: false,
                    errorAt: FieldValue.serverTimestamp(),
                },
            });
        } catch (_) {}

        return res.status(500).json({
            message:
                "Anfrage wurde gespeichert, aber E-Mail-Versand ist fehlgeschlagen. Bitte versuchen Sie es erneut oder rufen Sie an.",
        });
    }
}
