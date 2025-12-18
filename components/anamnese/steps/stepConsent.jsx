"use client";
import CheckboxField from "../fields/checkboxField";

export default function StepConsent() {
    return (
        <div className="space-y-4">
            <div className="rounded-xl border border-black/10 p-4 space-y-3">
                <CheckboxField
                    name="consentSmsReminder"
                    label="Ich bin einverstanden, dass Terminerinnerungen per SMS geschickt werden (optional)."
                />
                <CheckboxField
                    name="consentRecallSystem"
                    label="Ich bin mit der Aufnahme in das Recall-System einverstanden (optional)."
                />
            </div>

            <div className="rounded-xl border border-black/10 p-4 space-y-3">
                <CheckboxField
                    name="confirmWillInformChanges"
                    label="Ich verpflichte mich, Änderungen während der Behandlungszeit umgehend mitzuteilen (Adresse, Medikamente, Krankheiten, Telefonnummern).*"
                />
                <CheckboxField
                    name="consentAppointmentPolicy"
                    label="Ich habe die Patienteninformation zur Berechnung nicht eingehaltener Behandlungstermine zur Kenntnis genommen.*"
                />
                <CheckboxField
                    name="consentDataProcessing"
                    label="Ich willige in die elektronische Speicherung, Bearbeitung und Nutzung meiner Daten zur Behandlung ein.*"
                />
            </div>
        </div>
    );
}
