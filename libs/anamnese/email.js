// libs/anamnese/email.js
import nodemailer from "nodemailer";

const yesNo = (v) => (v === true ? "Ja" : v === false ? "Nein" : "—");
const txt = (v) => (v === null || v === undefined || String(v).trim() === "" ? "—" : String(v));

const row = (k, v) => `
<tr>
  <td style="padding:6px 10px;border-bottom:1px solid #eee;width:260px;color:#0B2A4A;font-weight:bold;vertical-align:top;">
    ${k}
  </td>
  <td style="padding:6px 10px;border-bottom:1px solid #eee;vertical-align:top;">
    ${txt(v)}
  </td>
</tr>
`;

const section = (title) => `
<tr>
  <td colspan="2" style="padding:12px 10px 6px;color:#0B2A4A;font-size:15px;font-weight:bold;">
    ${title}
  </td>
</tr>
`;

export function buildAnamneseEmailHtml(data, { docId, pdfUrl } = {}) {
    const meds = Array.isArray(data.medications) ? data.medications : [];

    return `
<div style="font-family:Arial,sans-serif;font-size:14px;line-height:1.4;color:#111;">
  <h2 style="margin:0 0 8px;color:#0B2A4A;">Neue Online-Anamnese</h2>

  <div style="margin-bottom:14px;color:#444;font-size:13px;">
    <b>Dokument-ID:</b> ${txt(docId)}<br/>
    <b>Erstellt:</b> ${new Date().toLocaleString("de-AT")}<br/>
    ${pdfUrl ? `<b>PDF:</b> <a href="${pdfUrl}">${pdfUrl}</a><br/>` : ""}
  </div>

  <table style="border-collapse:collapse;width:100%;max-width:820px;border:1px solid #eee;">
    ${section("Patientendaten")}
    ${row("Vorname", data.firstName)}
    ${row("Nachname", data.lastName)}
    ${row("Geburtsdatum", data.birthDate)}
    ${row("Adresse", `${txt(data.street)}, ${txt(data.zip)} ${txt(data.city)}`)}
    ${row("E-Mail", data.email)}
    ${row("Telefon", data.phone)}
    ${row("Krankenkasse", data.insurance)}
    ${row("Zusatzversicherung", yesNo(data.hasSupplementaryInsurance))}

    ${section("Allgemeinerkrankungen")}
    ${row("Hoher Blutdruck", yesNo(data.highBloodPressure))}
    ${row("Niedriger Blutdruck", yesNo(data.lowBloodPressure))}
    ${row("Diabetes", yesNo(data.diabetes))}
    ${row("Asthma / Lungenerkrankung", yesNo(data.asthmaOrLungDisease))}
    ${row("Mukoviszidose", yesNo(data.cysticFibrosis))}
    ${row("Nierenerkrankung", yesNo(data.kidneyDisease))}
    ${row("Schilddrüsenerkrankung", yesNo(data.thyroidDisease))}
    ${row("Rheuma / Arthritis", yesNo(data.rheumaArthritis))}
    ${row("Erkrankung Nervensystem", yesNo(data.nervousSystemDisease))}
    ${row("Epilepsie", yesNo(data.epilepsy))}
    ${row("Gerinnungsstörungen", yesNo(data.coagulationDisorders))}
    ${row("Osteoporose", yesNo(data.osteoporosis))}
    ${row("Drogenabhängigkeit", yesNo(data.drugDependency))}
    ${row("Schwangerschaft", yesNo(data.pregnant))}
    ${row("Raucher", yesNo(data.smoker))}
    ${row("Ohnmachtsanfälle", yesNo(data.faintingSpells))}

    ${section("Herz / OP / Risiko")}
    ${row("Endokarditis", yesNo(data.endocarditis))}
    ${row("Herzklappenfehler", yesNo(data.heartValveDefect))}
    ${row("Herzklappenersatz", yesNo(data.heartValveReplacement))}
    ${row("Herzoperation", yesNo(data.heartSurgery))}
    ${row("Herzschrittmacher", yesNo(data.pacemaker))}

    ${section("Transplantation / Immunsystem")}
    ${row("Organtransplantation", yesNo(data.organTransplant))}
    ${row("Stammzelltransplantation", yesNo(data.stemCellTransplant))}
    ${row("Schwere Neutropenie", yesNo(data.severeNeutropenia))}
    ${row("Hochdosierte Steroide / Immunsuppressiva", yesNo(data.highDoseSteroidsOrImmunosuppressants))}

    ${section("Infektiöse Erkrankungen")}
    ${row("Tuberkulose", yesNo(data.tuberculosis))}
    ${row("HIV / AIDS", yesNo(data.hivAids))}
    ${row("Hepatitis / Lebererkrankung", yesNo(data.hepatitisLiverDisease))}
    ${row("Weitere infektiöse Erkrankung", yesNo(data.otherInfectiousDisease))}
    ${row("Weitere infektiöse Erkrankung (Text)", data.otherInfectiousDiseaseText)}

    ${section("Allergien / Unverträglichkeiten")}
    ${row("Lokalanästhetika", yesNo(data.allergyLocalAnesthesia))}
    ${row("Schmerzmittel", yesNo(data.allergyPainkillers))}
    ${row("Metalle", yesNo(data.allergyMetals))}
    ${row("Allergie-Hinweise", data.allergyNotes)}
    ${row("Probleme nach Injektionen", yesNo(data.problemsAfterInjections))}

    ${section("Medikamente / Therapie")}
    ${row("Nimmt Medikamente", yesNo(data.takesMedication))}
    ${
        meds.length
            ? meds
                  .map((m, i) =>
                      row(`Medikament ${i + 1}`, `${txt(m?.name)}${m?.since ? ` (seit ${txt(m.since)})` : ""}`)
                  )
                  .join("")
            : row("Medikamentenliste", "—")
    }
    ${row("Bisphosphonate", yesNo(data.bisphosphonates))}
    ${row("Chemotherapie", yesNo(data.chemoTherapy))}
    ${row("Strahlentherapie", yesNo(data.radiationTherapy))}
    ${row("Körpergewicht (kg)", data.weightKg)}

    ${section("Zahnärztliche Anamnese")}
    ${row("CMD", yesNo(data.cmd))}
    ${row("Kiefergelenksbeschwerden", yesNo(data.tmjComplaints))}
    ${row("Kieferverletzung / Fraktur", yesNo(data.jawInjuryOrFracture))}
    ${row("Kopf-/Halsverletzungen", yesNo(data.headNeckInjuries))}
    ${row("Kopf-/Halsoperationen", yesNo(data.headNeckSurgeries))}
    ${row("Zähne durch Unfall verloren", yesNo(data.teethLostByAccident))}
    ${row("KFO-Behandlung", yesNo(data.hadOrthodonticTreatment))}
    ${row("Zähne gezogen (KFO)", yesNo(data.orthodonticTeethExtracted))}
    ${row("Kürzlich Zahn-Röntgen", yesNo(data.recentDentalXrays))}
    ${row("Nachblutung nach Behandlung", yesNo(data.bleedingAfterDentalTreatment))}
    ${row("Zahnärztliche Hinweise", data.dentalNotes)}

    ${section("Behandlungswünsche / Herkunft")}
    ${row("Wünscht Beratung", yesNo(data.wantsConsultation))}
    ${row("Implantate", yesNo(data.consultationImplants))}
    ${row("Wurzelkanalbehandlung", yesNo(data.consultationRootCanal))}
    ${row("Prothetik (Kronen/Brücken)", yesNo(data.consultationProstheticsCrownsBridges))}
    ${row("Keramik-/Gold-Inlay", yesNo(data.consultationCeramicGoldInlay))}
    ${row("Bleaching", yesNo(data.consultationBleaching))}
    ${row("Kieferorthopädie", yesNo(data.consultationOrthodontics))}
    ${row("Amalgam-Austausch", yesNo(data.consultationAmalgamReplacement))}

    ${row("Quelle: Internet", yesNo(data.sourceInternet))}
    ${row("Quelle: Empfehlung", yesNo(data.sourceRecommendation))}
    ${row("Quelle: Telefonbuch", yesNo(data.sourcePhoneBook))}
    ${row("Quelle: Sonstiges", yesNo(data.sourceOther))}
    ${row("Quelle Sonstiges (Text)", data.sourceOtherText)}
    ${row("Suchbegriffe", data.usedSearchTerms)}

    ${section("Einwilligungen")}
    ${row("Datenverarbeitung", yesNo(data.consentDataProcessing))}
    ${row("Terminausfall-Regelung", yesNo(data.consentAppointmentPolicy))}
    ${row("Änderungen mitteilen", yesNo(data.confirmWillInformChanges))}
    ${row("SMS-Reminder", yesNo(data.consentSmsReminder))}
    ${row("Recall-System", yesNo(data.consentRecallSystem))}
  </table>

  <p style="margin-top:16px;color:#777;font-size:12px;">
    Hinweis: Diese E-Mail enthält sensible Gesundheitsdaten und ist ausschließlich für die Praxis bestimmt.
  </p>
</div>
`;
}

export async function sendAnamneseEmail({ to, subject, html, attachments = [] }) {
    const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: Number(process.env.SMTP_PORT || 587),
        secure: false,
        auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS,
        },
    });

    return transporter.sendMail({
        from: process.env.SMTP_FROM,
        to,
        subject,
        html,
        attachments,
    });
}
