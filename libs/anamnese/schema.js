import { z } from "zod";

const MedicationItem = z.object({
    name: z.string().min(1, "Medikament erforderlich"),
    since: z.string().optional(), // "Seit?" – als Freitext/Datum
});

export const anamnesisSchema = z
    .object({
        // =========================
        // STEP 1 – Patientendaten
        // =========================
        title: z.string().optional(), // Name/Titel
        firstName: z.string().min(1, "Vorname ist erforderlich"),
        lastName: z.string().min(1, "Nachname ist erforderlich"),
        birthDate: z.string().min(1, "Geburtsdatum ist erforderlich"),

        street: z.string().min(1, "Straße/Nr. ist erforderlich"),
        zip: z.string().min(1, "PLZ ist erforderlich"),
        city: z.string().min(1, "Ort ist erforderlich"),

        email: z.string().email("Bitte gültige E-Mail angeben"),
        phone: z.string().min(1, "Telefon ist erforderlich"),
        phoneWork: z.string().optional(),

        profession: z.string().optional(),
        employer: z.string().optional(),

        insurance: z.string().min(1, "Krankenkasse ist erforderlich"),

        // Familienmitglied / Hauptversicherter
        isFamilyMember: z.boolean().default(false),
        relationshipToPrimaryInsured: z.string().optional(),

        primaryInsuredTitle: z.string().optional(),
        primaryInsuredFirstName: z.string().optional(),
        primaryInsuredLastName: z.string().optional(),
        primaryInsuredBirthDate: z.string().optional(),
        primaryInsuredStreet: z.string().optional(),
        primaryInsuredZip: z.string().optional(),
        primaryInsuredCity: z.string().optional(),
        primaryInsuredProfession: z.string().optional(),
        primaryInsuredPhonePrivate: z.string().optional(),
        primaryInsuredPhoneWork: z.string().optional(),

        // Zusatzversicherung
        hasSupplementaryInsurance: z.boolean().default(false),
        supplementaryInsuranceName: z.string().optional(),

        // Hausarzt
        gpName: z.string().optional(),
        gpPhone: z.string().optional(),

        // =========================
        // STEP 2 – Allgemeinanamnese (Erkrankungen)
        // =========================
        // Herz/Kreislauf & Blut
        highBloodPressure: z.boolean().default(false),
        lowBloodPressure: z.boolean().default(false),
        heartValveDefect: z.boolean().default(false),
        heartValveReplacement: z.boolean().default(false),
        pacemaker: z.boolean().default(false),
        endocarditis: z.boolean().default(false),
        heartSurgery: z.boolean().default(false),
        severeNeutropenia: z.boolean().default(false),
        coagulationDisorders: z.boolean().default(false),

        // Transplantationen
        organTransplant: z.boolean().default(false),
        stemCellTransplant: z.boolean().default(false),

        // Atemwege
        asthmaOrLungDisease: z.boolean().default(false),

        // Stoffwechsel / Endokrin
        diabetes: z.boolean().default(false),
        thyroidDisease: z.boolean().default(false),

        // Neurologie / Sonstiges
        epilepsy: z.boolean().default(false),
        nervousSystemDisease: z.boolean().default(false),
        faintingSpells: z.boolean().default(false),

        // Bewegungsapparat
        rheumaArthritis: z.boolean().default(false),
        osteoporosis: z.boolean().default(false),

        // Niere
        kidneyDisease: z.boolean().default(false),

        // Mukoviszidose
        cysticFibrosis: z.boolean().default(false),

        // Abhängigkeiten / Lifestyle
        drugDependency: z.boolean().default(false),
        smoker: z.boolean().default(false),

        // Sonstige Erkrankungen (Freitext)
        otherDiseases: z.boolean().default(false),
        otherDiseasesText: z.string().optional(),

        // =========================
        // STEP 3 – Infektiöse Erkrankungen + Therapien/Medikationen
        // =========================
        hivAids: z.boolean().default(false),
        hepatitisLiverDisease: z.boolean().default(false),
        tuberculosis: z.boolean().default(false),
        otherInfectiousDisease: z.boolean().default(false),
        otherInfectiousDiseaseText: z.string().optional(),

        bisphosphonates: z.boolean().default(false),
        chemoTherapy: z.boolean().default(false),
        radiationTherapy: z.boolean().default(false),
        highDoseSteroidsOrImmunosuppressants: z.boolean().default(false),

        // =========================
        // STEP 4 – Allergien & Medikamente
        // =========================
        allergyLocalAnesthesia: z.boolean().default(false),
        allergyAntibiotics: z.boolean().default(false),
        allergyPainkillers: z.boolean().default(false),
        allergyMetals: z.boolean().default(false),
        allergyNotes: z.string().optional(),

        takesMedication: z.boolean().default(false),
        medications: z.array(MedicationItem).optional(),

        // Körpergewicht
        weightKg: z.coerce.number().positive().optional(),

        // =========================
        // STEP 5 – Zahnärztliche Anamnese / Kopf-Hals
        // =========================
        headNeckInjuries: z.boolean().default(false),
        headNeckSurgeries: z.boolean().default(false),

        hadOrthodonticTreatment: z.boolean().default(false), // Zahnspange
        orthodonticTeethExtracted: z.boolean().default(false), // Zähne gezogen im Zusammenhang

        tmjComplaints: z.boolean().default(false), // Knacken, Reiben etc.
        bleedingAfterDentalTreatment: z.boolean().default(false), // Nachblutungen
        recentDentalXrays: z.boolean().default(false),

        problemsAfterInjections: z.boolean().default(false), // z.B. Schwindel
        cmd: z.boolean().default(false),

        teethLostByAccident: z.boolean().default(false),
        jawInjuryOrFracture: z.boolean().default(false),

        pregnant: z.boolean().default(false),

        // Freitext: falls ihr es wollt (optional)
        dentalNotes: z.string().optional(),

        // =========================
        // STEP 6 – Wünsche / Marketing
        // =========================
        wantsConsultation: z.boolean().default(false),
        consultationImplants: z.boolean().default(false),
        consultationBleaching: z.boolean().default(false),
        consultationCeramicGoldInlay: z.boolean().default(false),
        consultationAmalgamReplacement: z.boolean().default(false),
        consultationRootCanal: z.boolean().default(false),
        consultationProstheticsCrownsBridges: z.boolean().default(false),
        consultationOrthodontics: z.boolean().default(false),

        // Wie aufmerksam geworden
        sourceRecommendation: z.boolean().default(false),
        sourceInternet: z.boolean().default(false),
        sourcePhoneBook: z.boolean().default(false),
        sourceOther: z.boolean().default(false),
        sourceOtherText: z.string().optional(),
        usedSearchTerms: z.string().optional(),

        // =========================
        // STEP 7 – Einwilligungen / Bestätigungen
        // =========================
        consentSmsReminder: z.boolean().default(false),
        consentRecallSystem: z.boolean().default(false),

        // Pflicht: „Änderungen mitteilen“ (aus PDF)
        confirmWillInformChanges: z.boolean(),

        // Pflicht: Terminausfall-Info zur Kenntnis genommen
        consentAppointmentPolicy: z.boolean(),

        // Pflicht: elektronische Speicherung/Verarbeitung (Behandlungszweck)
        consentDataProcessing: z.boolean(),
    })
    .superRefine((data, ctx) => {
        // Hauptversicherter nur wenn Familienmitglied
        if (data.isFamilyMember) {
            if (!data.relationshipToPrimaryInsured?.trim()) {
                ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    path: ["relationshipToPrimaryInsured"],
                    message: "Bitte Verwandtschaftsgrad angeben",
                });
            }
            // Minimal: Name des Hauptversicherten verlangen
            const hasName = (data.primaryInsuredFirstName?.trim() || "") && (data.primaryInsuredLastName?.trim() || "");
            if (!hasName) {
                ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    path: ["primaryInsuredFirstName"],
                    message: "Bitte Vor- und Nachname des Hauptversicherten angeben",
                });
            }
        }

        // Zusatzversicherung Name wenn Ja
        if (data.hasSupplementaryInsurance && !data.supplementaryInsuranceName?.trim()) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                path: ["supplementaryInsuranceName"],
                message: "Bitte Versicherungsgesellschaft angeben",
            });
        }

        // Sonstige Erkrankungen Text wenn aktiviert
        if (data.otherDiseases && !data.otherDiseasesText?.trim()) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                path: ["otherDiseasesText"],
                message: "Bitte kurz erläutern",
            });
        }

        // Andere Infektionskrankheiten Text wenn aktiviert
        if (data.otherInfectiousDisease && !data.otherInfectiousDiseaseText?.trim()) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                path: ["otherInfectiousDiseaseText"],
                message: "Bitte kurz erläutern",
            });
        }

        // Medikamente: wenn takesMedication = true, mind. 1 Eintrag
        if (data.takesMedication) {
            const meds = data.medications ?? [];
            if (meds.length === 0) {
                ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    path: ["medications"],
                    message: "Bitte mindestens ein Medikament angeben",
                });
            }
        }

        // Pflicht-Consents
        if (!data.consentDataProcessing) {
            ctx.addIssue({ code: z.ZodIssueCode.custom, path: ["consentDataProcessing"], message: "Erforderlich" });
        }
        if (!data.consentAppointmentPolicy) {
            ctx.addIssue({ code: z.ZodIssueCode.custom, path: ["consentAppointmentPolicy"], message: "Erforderlich" });
        }
        if (!data.confirmWillInformChanges) {
            ctx.addIssue({ code: z.ZodIssueCode.custom, path: ["confirmWillInformChanges"], message: "Erforderlich" });
        }
    });
