// libs/anamnese/pdf.js
import { PDFDocument, StandardFonts, rgb } from "pdf-lib";

const A4 = { w: 595.28, h: 841.89 };
const M = 48;

function boolText(v) {
    if (v === true) return "Ja";
    if (v === false) return "Nein";
    return "—";
}

function textOrDash(v) {
    if (v === null || v === undefined) return "—";
    if (typeof v === "string") return v.trim() ? v.trim() : "—";
    if (typeof v === "number") return Number.isFinite(v) ? String(v) : "—";
    return String(v);
}

function joinParts(parts, sep = " ") {
    const cleaned = parts.map((p) => (p === null || p === undefined ? "" : String(p).trim())).filter(Boolean);
    return cleaned.length ? cleaned.join(sep) : "—";
}

function wrapText(font, text, size, maxWidth) {
    const s = String(text ?? "");
    if (!s) return ["—"];

    const words = s.split(/\s+/).filter(Boolean);
    const lines = [];
    let line = "";

    for (const w of words) {
        const test = line ? `${line} ${w}` : w;
        const width = font.widthOfTextAtSize(test, size);
        if (width <= maxWidth) {
            line = test;
        } else {
            if (line) lines.push(line);
            line = w;
        }
    }
    if (line) lines.push(line);
    return lines.length ? lines : ["—"];
}

export async function createAnamnesePdfBuffer(data, { docId } = {}) {
    const pdfDoc = await PDFDocument.create();
    const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
    const bold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

    let page = pdfDoc.addPage([A4.w, A4.h]);
    let y = A4.h - M;

    const ensureSpace = (needed = 20) => {
        if (y - needed < M) {
            page = pdfDoc.addPage([A4.w, A4.h]);
            y = A4.h - M;
        }
    };

    const drawTitle = (t) => {
        ensureSpace(40);
        page.drawText(t, { x: M, y, size: 20, font: bold, color: rgb(0.06, 0.16, 0.28) });
        y -= 26;
    };

    const drawMeta = (label, value) => {
        ensureSpace(18);
        const s = `${label}: ${textOrDash(value)}`;
        page.drawText(s, { x: M, y, size: 10.5, font, color: rgb(0.15, 0.15, 0.15) });
        y -= 14;
    };

    const drawSection = (t) => {
        ensureSpace(28);
        y -= 6;
        page.drawText(t, { x: M, y, size: 12.5, font: bold, color: rgb(0, 0, 0) });
        y -= 10;
        // kleine Linie
        page.drawLine({
            start: { x: M, y },
            end: { x: A4.w - M, y },
            thickness: 1,
            color: rgb(0.85, 0.86, 0.88),
        });
        y -= 14;
    };

    // Label/Value zweispaltig
    const drawRow = (label, value) => {
        ensureSpace(22);

        const labelX = M;
        const valueX = 220; // Spalte 2
        const labelW = 190;
        const valueW = A4.w - M - valueX;

        const labelLines = wrapText(bold, label, 10.5, labelW);
        const valueLines = wrapText(font, textOrDash(value), 10.5, valueW);
        const lines = Math.max(labelLines.length, valueLines.length);

        for (let i = 0; i < lines; i++) {
            ensureSpace(14);
            const ly = y;
            if (labelLines[i]) page.drawText(labelLines[i], { x: labelX, y: ly, size: 10.5, font: bold });
            if (valueLines[i]) page.drawText(valueLines[i], { x: valueX, y: ly, size: 10.5, font });
            y -= 14;
        }

        y -= 2;
    };

    const drawBoolRow = (label, v) => drawRow(label, boolText(v));

    // Medikamente-Liste
    const drawMedications = (arr) => {
        const meds = Array.isArray(arr) ? arr : [];
        if (!meds.length) {
            drawRow("Medikamentenliste", "—");
            return;
        }
        meds.forEach((m, idx) => {
            const name = textOrDash(m?.name);
            const since = m?.since ? ` (seit ${textOrDash(m.since)})` : "";
            drawRow(`Medikament ${idx + 1}`, `${name}${since}`);
        });
    };

    // ---- PDF CONTENT (ALLE Felder aus deinem Firestore-Screenshot) ----

    drawTitle("Online-Anamnese");
    drawMeta("Dokument-ID", docId);
    drawMeta("Erstellt", new Date().toLocaleString("de-AT"));

    drawSection("Patientendaten");
    drawRow("Vorname", data.firstName);
    drawRow("Nachname", data.lastName);
    drawRow("Geburtsdatum", data.birthDate);
    drawRow("Adresse", joinParts([data.street, `${textOrDash(data.zip)} ${textOrDash(data.city)}`], ", "));
    drawRow("E-Mail", data.email);
    drawRow("Telefon", data.phone);
    drawRow("Krankenkasse", data.insurance);
    drawBoolRow("Zusatzversicherung", data.hasSupplementaryInsurance);

    // optional im Datensatz (bei dir aktuell leer/fehlt – trotzdem korrekt ausgeben)
    drawRow("Zusatzversicherung bei", data.supplementaryInsuranceProvider);
    drawBoolRow("Familienversichert / abweichender Hauptversicherter", data.isFamilyMember);

    drawSection("Allgemeinerkrankungen");
    drawBoolRow("Hoher Blutdruck", data.highBloodPressure);
    drawBoolRow("Niedriger Blutdruck", data.lowBloodPressure);
    drawBoolRow("Diabetes", data.diabetes);
    drawBoolRow("Asthma / Lungenerkrankung", data.asthmaOrLungDisease);
    drawBoolRow("Mukoviszidose", data.cysticFibrosis);
    drawBoolRow("Nierenerkrankung", data.kidneyDisease);
    drawBoolRow("Schilddrüsenerkrankung", data.thyroidDisease);
    drawBoolRow("Rheuma / Arthritis", data.rheumaArthritis);
    drawBoolRow("Erkrankung des Nervensystems", data.nervousSystemDisease);
    drawBoolRow("Epilepsie", data.epilepsy);
    drawBoolRow("Gerinnungsstörungen", data.coagulationDisorders);
    drawBoolRow("Osteoporose", data.osteoporosis);
    drawBoolRow("Drogenabhängigkeit", data.drugDependency);
    drawBoolRow("Schwangerschaft", data.pregnant);
    drawBoolRow("Raucher", data.smoker);
    drawBoolRow("Ohnmachtsanfälle / Kreislaufprobleme", data.faintingSpells);

    // Herz / OP / Risiken
    drawBoolRow("Endokarditis", data.endocarditis);
    drawBoolRow("Herzklappenfehler", data.heartValveDefect);
    drawBoolRow("Herzklappenersatz", data.heartValveReplacement);
    drawBoolRow("Herzoperation", data.heartSurgery);
    drawBoolRow("Herzschrittmacher", data.pacemaker);

    // Transplant / Immunsystem
    drawBoolRow("Organtransplantation", data.organTransplant);
    drawBoolRow("Stammzelltransplantation", data.stemCellTransplant);
    drawBoolRow("Schwere Neutropenie", data.severeNeutropenia);
    drawBoolRow("Hochdosierte Steroide / Immunsuppressiva", data.highDoseSteroidsOrImmunosuppressants);

    // Sonstiges (falls vorhanden)
    drawBoolRow("Sonstige Erkrankungen", data.otherDiseases);
    drawRow("Sonstige Erkrankungen (Text)", data.otherDiseasesText);

    drawSection("Infektiöse Erkrankungen");
    drawBoolRow("Tuberkulose", data.tuberculosis);
    drawBoolRow("HIV / AIDS", data.hivAids);
    drawBoolRow("Hepatitis / Lebererkrankung", data.hepatitisLiverDisease);
    drawBoolRow("Weitere infektiöse Erkrankung", data.otherInfectiousDisease);
    drawRow("Weitere infektiöse Erkrankung (Text)", data.otherInfectiousDiseaseText);

    drawSection("Allergien / Unverträglichkeiten");
    drawBoolRow("Lokalanästhetika", data.allergyLocalAnesthesia);
    drawBoolRow("Schmerzmittel", data.allergyPainkillers);
    drawBoolRow("Metalle", data.allergyMetals);
    drawRow("Allergie-Hinweise", data.allergyNotes);
    drawBoolRow("Probleme nach Spritzen / Injektionen", data.problemsAfterInjections);

    drawSection("Medikamente / Therapie");
    drawBoolRow("Nimmt Medikamente", data.takesMedication);
    drawMedications(data.medications);
    drawBoolRow("Bisphosphonate", data.bisphosphonates);
    drawBoolRow("Chemotherapie", data.chemoTherapy);
    drawBoolRow("Strahlentherapie", data.radiationTherapy);
    // Falls du im Formular extra Steroide/Immunsuppressiva als eigene Checkbox hast:
    drawBoolRow("Steroide / Immunsuppressiva", data.steroidsImmunosuppressants);
    drawRow("Körpergewicht (kg)", data.weightKg);

    drawSection("Zahnärztliche Anamnese");
    drawBoolRow("CMD", data.cmd);
    drawBoolRow("Kiefergelenksbeschwerden (TMJ)", data.tmjComplaints);
    drawBoolRow("Kieferverletzung / Fraktur", data.jawInjuryOrFracture);
    drawBoolRow("Kopf-/Halsverletzungen", data.headNeckInjuries);
    drawBoolRow("Kopf-/Halsoperationen", data.headNeckSurgeries);
    drawBoolRow("Zähne durch Unfall verloren", data.teethLostByAccident);
    drawBoolRow("Kieferorthopädische Behandlung", data.hadOrthodonticTreatment);
    drawBoolRow("Zähne gezogen (KFO)", data.orthodonticTeethExtracted);
    drawBoolRow("Kürzlich Röntgen beim Zahnarzt", data.recentDentalXrays);
    drawBoolRow("Nach Zahnbehandlung Nachblutung", data.bleedingAfterDentalTreatment);
    drawRow("Zahnärztliche Hinweise", data.dentalNotes);

    drawSection("Behandlungswünsche / Herkunft");
    drawBoolRow("Wünscht Beratung", data.wantsConsultation);
    drawBoolRow("Beratung: Implantate", data.consultationImplants);
    drawBoolRow("Beratung: Wurzelkanalbehandlung", data.consultationRootCanal);
    drawBoolRow("Beratung: Prothetik (Kronen/Brücken)", data.consultationProstheticsCrownsBridges);
    drawBoolRow("Beratung: Keramik-/Gold-Inlay", data.consultationCeramicGoldInlay);
    drawBoolRow("Beratung: Bleaching", data.consultationBleaching);
    drawBoolRow("Beratung: KFO", data.consultationOrthodontics);
    drawBoolRow("Beratung: Amalgam-Austausch", data.consultationAmalgamReplacement);

    // “Wie sind Sie auf uns aufmerksam geworden”
    drawBoolRow("Quelle: Internet", data.sourceInternet);
    drawBoolRow("Quelle: Empfehlung", data.sourceRecommendation);
    drawBoolRow("Quelle: Telefonbuch", data.sourcePhoneBook);
    drawBoolRow("Quelle: Sonstiges", data.sourceOther);
    drawRow("Quelle: Sonstiges (Text)", data.sourceOtherText);
    drawRow("Verwendete Suchbegriffe", data.usedSearchTerms);

    drawSection("Einwilligungen");
    drawBoolRow("Datenverarbeitung", data.consentDataProcessing);
    drawBoolRow("Terminausfall-Regelung", data.consentAppointmentPolicy);
    drawBoolRow("Änderungen mitteilen", data.confirmWillInformChanges);
    drawBoolRow("SMS Reminder", data.consentSmsReminder);
    drawBoolRow("Recall-System", data.consentRecallSystem);

    const bytes = await pdfDoc.save();
    return Buffer.from(bytes);
}
