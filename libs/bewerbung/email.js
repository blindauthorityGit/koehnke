// libs/bewerbung/email.js
import nodemailer from "nodemailer";

function esc(s) {
    return String(s ?? "")
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");
}

const row = (k, v) => `
  <tr>
    <td style="padding:6px 10px;border-bottom:1px solid #eee;width:240px;color:#0B2A4A;"><b>${esc(k)}</b></td>
    <td style="padding:6px 10px;border-bottom:1px solid #eee;">${esc(v ?? "") || "—"}</td>
  </tr>
`;

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

export function buildEmployerApplicationEmailHtml(data, { id, fileLinks = [] } = {}) {
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
    } = data;

    const linksHtml = fileLinks?.length
        ? `<ul style="margin:8px 0 0;padding-left:18px;">
          ${fileLinks
              .map(
                  (f) =>
                      `<li style="margin:6px 0;">
                  <a href="${f.url}" target="_blank" rel="noopener noreferrer">${esc(f.label)}: ${esc(f.name)}</a>
                </li>`
              )
              .join("")}
        </ul>`
        : `<p style="margin:8px 0 0;color:#64748b;">Keine Dateien.</p>`;

    return `
  <div style="font-family:Arial,sans-serif;line-height:1.4;color:#111;">
    <h2 style="margin:0 0 8px;color:#0B2A4A;">Neue Online-Bewerbung</h2>
    <p style="margin:0 0 12px;color:#334155;">
      <b>Stelle:</b> ${esc(jobTitle)}<br/>
      <b>Slug:</b> ${esc(jobSlug)}<br/>
      <b>ID:</b> ${esc(id || "—")}
    </p>

    <table style="border-collapse:collapse;width:100%;max-width:900px;background:#fff;border:1px solid #eee;border-radius:10px;overflow:hidden;">
      ${row("Vorname", firstName)}
      ${row("Nachname", lastName)}
      ${row("E-Mail", email)}
      ${row("Telefon", phone)}
      ${row("Wohnort", city)}
      ${row("Start", startASAP ? "ab sofort" : startDate)}
      ${row("Beschäftigungsart", employmentType)}
      ${row("Wochenstunden", hoursPerWeek)}
      ${row("Nachricht", message)}
      ${row("Erfahrung", experience)}
    </table>

    <h3 style="margin:16px 0 6px;color:#0B2A4A;">Uploads</h3>
    ${linksHtml}

    <p style="margin:14px 0 0;color:#64748b;font-size:12px;">
      Hinweis: Downloadlinks können zeitlich begrenzt sein.
    </p>
  </div>
  `;
}

export function buildApplicantThanksEmailHtml(data) {
    const { firstName, lastName, jobTitle } = data;

    return `
  <div style="font-family:Arial,sans-serif;line-height:1.5;color:#111;">
    <h2 style="margin:0 0 8px;color:#0B2A4A;">Vielen Dank für Ihre Bewerbung</h2>
    <p style="margin:0 0 10px;color:#334155;">
      Hallo ${esc(firstName)} ${esc(lastName)},<br/>
      vielen Dank für Ihre Bewerbung als <b>${esc(jobTitle)}</b>.
      Wir melden uns so bald wie möglich bei Ihnen.
    </p>
    <p style="margin:0;color:#64748b;font-size:12px;">
      Bitte antworten Sie nicht auf diese E-Mail.
    </p>
  </div>
  `;
}

export async function sendBewerbungEmail({ to, subject, html, replyTo } = {}) {
    const from = process.env.MAIL_FROM;
    if (!from) throw new Error("Missing MAIL_FROM env var.");

    const transporter = getTransporter();
    return transporter.sendMail({
        from,
        to,
        subject,
        html,
        ...(replyTo ? { replyTo } : {}),
    });
}
