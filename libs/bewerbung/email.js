// libs/bewerbung/email.js
import nodemailer from "nodemailer";

// ------------------------------------------------------------
// Utils
// ------------------------------------------------------------
function esc(s) {
    return String(s ?? "")
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");
}

function isDevMode() {
    const v = String(process.env.DEV_MODE ?? "")
        .toLowerCase()
        .trim();
    return v === "1" || v === "true" || v === "yes" || v === "on";
}

/**
 * category:
 * - "bewerbung" => BEWERBUNG_TO_LIVE
 * - "contact"   => CONTACT_TO_LIVE  (z.B. Termin, Anamnese, Kontakt)
 * - "custom"    => nutzt "to" direkt (aber DEV override greift trotzdem)
 */
function resolveRecipient({ to, category = "custom" } = {}) {
    const devOverride = String(process.env.DEV_EMAIL_OVERRIDE || "").trim();
    if (isDevMode() && devOverride) return devOverride;

    if (category === "bewerbung") return String(process.env.BEWERBUNG_TO_LIVE || to || "").trim();
    if (category === "contact") return String(process.env.CONTACT_TO_LIVE || to || "").trim();

    return String(to || "").trim();
}

function getTransporter() {
    const host = process.env.SMTP_HOST;
    const port = Number(process.env.SMTP_PORT || 587);
    const user = process.env.SMTP_USER;
    const pass = process.env.SMTP_PASS;

    if (!host || !user || !pass) {
        throw new Error("Missing SMTP env vars (SMTP_HOST/SMTP_PORT/SMTP_USER/SMTP_PASS).");
    }

    return nodemailer.createTransport({
        host,
        port,
        secure: port === 465,
        auth: { user, pass },
    });
}

// ------------------------------------------------------------
// Styling helpers (mail-safe / Outlook-friendly)
// ------------------------------------------------------------
const colors = {
    bg: "#f1f5f9",
    card: "#ffffff",
    border: "#e2e8f0",
    text: "#0f172a",
    muted: "#64748b",
    brand: "#0f172a",
};

const wrap = (inner, { footerText = "Automatisch generiert – Website-Formular" } = {}) => `
<!doctype html>
<html lang="de">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width,initial-scale=1" />
    <title>E-Mail</title>
  </head>
  <body style="margin:0;padding:0;background:${colors.bg};">
    <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="background:${colors.bg};padding:24px 0;">
      <tr>
        <td align="center" style="padding:0 14px;">
          <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="680" style="max-width:680px;width:100%;">
            <tr>
              <td style="background:${colors.card};border-radius:22px;overflow:hidden;">
                ${inner}
              </td>
            </tr>
            <tr>
              <td style="text-align:center;font-size:11px;color:#94a3b8;padding:14px 0;">
                ${esc(footerText)}
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>
`;

const header = ({ kicker, title, subtitle }) => `
  <div style="padding:20px 22px;background:${colors.brand};color:#ffffff;">
    <div style="font-size:12px;letter-spacing:0.08em;text-transform:uppercase;opacity:0.85;">
      ${esc(kicker || "")}
    </div>
    <div style="font-size:20px;font-weight:800;margin-top:6px;line-height:1.25;">
      ${esc(title || "")}
    </div>
    ${subtitle ? `<div style="font-size:13px;opacity:0.9;margin-top:6px;">${subtitle}</div>` : ""}
  </div>
`;

/**
 * row:
 * - default: esc() value
 * - raw: allow trusted HTML (ONLY from our own template building)
 */
const row = (k, v, { raw = false } = {}) => {
    const val = String(v ?? "").trim();
    const display = val ? (raw ? val : esc(val)) : "—";

    return `
      <tr>
        <td style="padding:10px 14px;font-weight:700;color:${colors.text};width:200px;vertical-align:top;border-top:1px solid ${colors.border};">
          ${esc(k)}
        </td>
        <td style="padding:10px 14px;color:${colors.text};vertical-align:top;border-top:1px solid ${colors.border};">
          ${display}
        </td>
      </tr>
    `;
};

function textBlock(title, content) {
    const c = String(content ?? "").trim();
    if (!c) return "";
    return `
      <div style="margin-top:18px;">
        <div style="font-size:14px;font-weight:800;color:${colors.text};margin-bottom:8px;">
          ${esc(title)}
        </div>
        <div style="white-space:pre-wrap;background:#f8fafc;border:1px solid ${colors.border};padding:12px 14px;border-radius:16px;color:${colors.text};line-height:1.6;font-size:13px;">
          ${esc(c)}
        </div>
      </div>
    `;
}

// Outlook-safe button
function button(href, label) {
    if (!href) return "";
    return `
      <table role="presentation" cellpadding="0" cellspacing="0" border="0">
        <tr>
          <td style="border-radius:14px;" bgcolor="${colors.brand}">
            <a href="${href}" target="_blank" rel="noopener noreferrer"
              style="display:inline-block;padding:12px 16px;font-size:13px;font-weight:800;color:#ffffff;text-decoration:none;border-radius:14px;">
              ${esc(label)}
            </a>
          </td>
        </tr>
      </table>
    `;
}

// ------------------------------------------------------------
// Bewerbungen: Employer mail
// ------------------------------------------------------------
export function buildEmployerApplicationEmailHtml(data, { id, fileLinks = [], expiresDays = 5 } = {}) {
    const {
        jobTitle,
        jobSlug,
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
    } = data || {};

    const startInfo = startASAP ? "ab sofort" : startDate || "";
    const hoursInfo = hoursPerWeek || "—";

    const emailHtml = email
        ? `<a href="mailto:${esc(email)}" style="color:${colors.text};text-decoration:underline;text-underline-offset:3px;">${esc(
              email,
          )}</a>`
        : "";

    const phoneHtml = phone
        ? `<a href="tel:${esc(phone)}" style="color:${colors.text};text-decoration:underline;text-underline-offset:3px;">${esc(
              phone,
          )}</a>`
        : "";

    const filesBlock = fileLinks?.length
        ? `
          <div style="margin-top:18px;">
            <div style="font-size:14px;font-weight:800;color:${colors.text};margin-bottom:10px;">
              Dokumente (Links gültig ${Number(expiresDays) || 5} Tage)
            </div>

            ${fileLinks
                .map((f) => {
                    const label = f?.label ? esc(f.label) : "Dokument";
                    const name = f?.name ? ` <span style="color:${colors.muted};">(${esc(f.name)})</span>` : "";
                    const url = f?.url;

                    return `
                      <div style="margin:12px 0;padding:12px 14px;border:1px solid ${colors.border};border-radius:18px;background:#ffffff;">
                        <div style="font-size:13px;color:#334155;margin:0 0 8px;font-weight:700;">
                          ${label}${name}
                        </div>
                        ${button(url, "Download öffnen")}
                      </div>
                    `;
                })
                .join("")}

            <div style="margin-top:12px;font-size:12px;color:${colors.muted};line-height:1.5;">
              Hinweis: Bitte leiten Sie diese E-Mail und die Download-Links nicht unnötig weiter. Die Links laufen automatisch ab.
            </div>
          </div>
        `
        : `
          <div style="margin-top:18px;font-size:13px;color:#334155;">
            Es wurden keine Dokumente übermittelt.
          </div>
        `;

    const inner = `
      ${header({
          kicker: "Bewerbungseingang",
          title: `Neue Bewerbung: ${jobTitle || "Offene Stelle"}`,
          subtitle: `
            Bewerbung-ID: <strong>${esc(id || "—")}</strong>
            ${jobSlug ? `&nbsp;&nbsp;•&nbsp;&nbsp;Slug: <strong>${esc(jobSlug)}</strong>` : ""}
          `,
      })}

      <div style="padding:18px 22px;color:${colors.text};">
        <div style="font-size:14px;font-weight:800;margin-bottom:10px;">
          Bewerberdaten
        </div>

        <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%"
          style="border:1px solid ${colors.border};border-radius:18px;overflow:hidden;border-collapse:separate;">
          ${row("Vorname", firstName)}
          ${row("Nachname", lastName)}
          ${row("E-Mail", emailHtml, { raw: true })}
          ${row("Telefon", phoneHtml, { raw: true })}
          ${row("Wohnort", city)}
          ${row("Beschäftigungsart", employmentType)}
          ${row("Wochenstunden", hoursInfo)}
          ${row("Start", startInfo)}
        </table>

        ${textBlock("Nachricht der Bewerberin / des Bewerbers", message)}
        ${textBlock("Erfahrung / Zusatzinfo", experience)}

        ${filesBlock}

        <div style="margin-top:18px;font-size:12px;color:${colors.muted};line-height:1.5;">
          Diese E-Mail enthält personenbezogene Daten und ist vertraulich. Bitte nur an berechtigte Empfängerinnen und Empfänger weitergeben.
        </div>
      </div>
    `;

    return wrap(inner, { footerText: "Automatisch generiert – Bewerbungsformular" });
}

// ------------------------------------------------------------
// Bewerbungen: Applicant thanks
// ------------------------------------------------------------
export function buildApplicantThanksEmailHtml(data) {
    const { firstName, lastName, jobTitle } = data || {};

    const inner = `
      ${header({
          kicker: "Bestätigung",
          title: "Vielen Dank für Ihre Bewerbung",
          subtitle: jobTitle ? `Position: <strong>${esc(jobTitle)}</strong>` : "",
      })}

      <div style="padding:18px 22px;color:${colors.text};">
        <div style="font-size:13px;line-height:1.7;color:#334155;">
          Hallo ${esc(firstName)} ${esc(lastName)},<br/>
          vielen Dank für Ihre Bewerbung${jobTitle ? ` als <strong>${esc(jobTitle)}</strong>` : ""}.<br/>
          Wir melden uns so bald wie möglich bei Ihnen.
        </div>

        <div style="margin-top:14px;font-size:12px;color:${colors.muted};line-height:1.5;">
          Bitte antworten Sie nicht auf diese E-Mail.
        </div>
      </div>
    `;

    return wrap(inner, { footerText: "Automatisch generiert – Bewerbungsformular" });
}

// ------------------------------------------------------------
// Generic send (DEV override + category routing)
// ------------------------------------------------------------
export async function sendMail({ to, subject, html, text, replyTo, category = "custom" } = {}) {
    const from = process.env.MAIL_FROM || process.env.SMTP_FROM;
    if (!from) throw new Error("Missing MAIL_FROM (or SMTP_FROM) env var.");

    const resolvedTo = resolveRecipient({ to, category });
    if (!resolvedTo) throw new Error("Missing recipient (resolvedTo is empty).");

    const transporter = getTransporter();
    return transporter.sendMail({
        from,
        to: resolvedTo,
        subject,
        ...(html ? { html } : {}),
        ...(text ? { text } : {}),
        ...(replyTo ? { replyTo } : {}),
    });
}

// Backward-compatible wrapper (falls du schon überall sendBewerbungEmail nutzt)
export async function sendBewerbungEmail({ to, subject, html, replyTo } = {}) {
    return sendMail({ to, subject, html, replyTo, category: "bewerbung" });
}
