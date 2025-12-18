"use client";
import CheckList from "../fields/checkList";
import TextField from "../fields/textField";

export default function StepDental() {
    return (
        <div className="space-y-4">
            <CheckList
                title="Kopf / Hals / Zahnmedizin"
                items={[
                    { name: "headNeckInjuries", label: "Haben/Hatten Sie Verletzungen im Kopf-Hals-Bereich?" },
                    { name: "headNeckSurgeries", label: "Haben/Hatten Sie Operationen im Kopf-Hals-Bereich?" },

                    {
                        name: "hadOrthodonticTreatment",
                        label: "Haben/Hatten Sie eine kieferorthopädische Behandlung (Zahnspange)?",
                    },
                    {
                        name: "orthodonticTeethExtracted",
                        label: "Wurden im Zusammenhang mit der Kieferorthopädie Zähne gezogen?",
                    },

                    {
                        name: "tmjComplaints",
                        label: "Haben/Hatten Sie Kiefergelenksbeschwerden (Knacken, Reiben etc.)?",
                    },
                    { name: "cmd", label: "Haben/Hatten Sie eine CMD (Craniomandibuläre Dysfunktion)?" },

                    {
                        name: "bleedingAfterDentalTreatment",
                        label: "Traten bei bisherigen zahnärztlichen Eingriffen Nachblutungen auf?",
                    },
                    { name: "recentDentalXrays", label: "Wurden in letzter Zeit zahnärztliche Röntgenbilder gemacht?" },

                    {
                        name: "problemsAfterInjections",
                        label: "Haben Sie Probleme nach Spritzen beim Zahnarzt? (z. B. Schwindel)",
                    },

                    { name: "teethLostByAccident", label: "Haben/Hatten Sie Zähne durch Unfälle verloren?" },
                    {
                        name: "jawInjuryOrFracture",
                        label: "Haben/Hatten Sie Unfallverletzungen im Kieferbereich (z. B. Kieferbruch)?",
                    },

                    { name: "pregnant", label: "Besteht eine Schwangerschaft?" },
                ]}
            />

            <div className="rounded-xl border border-black/10 p-4">
                <TextField
                    name="dentalNotes"
                    label="Anmerkungen (optional)"
                    placeholder="Optional: zusätzliche Infos, die wichtig sind"
                />
            </div>
        </div>
    );
}
