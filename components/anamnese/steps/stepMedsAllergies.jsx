"use client";
import CheckList from "../fields/checkList";
import TextField from "../fields/textField";
import MedicationList from "../fields/medicationList";

export default function StepMedsAllergies() {
    return (
        <div className="space-y-4">
            <MedicationList />

            <CheckList
                title="Allergien bzw. Unverträglichkeiten"
                items={[
                    { name: "allergyLocalAnesthesia", label: "Lokalanästhesie / Spritzen" },
                    { name: "allergyAntibiotics", label: "Antibiotika" },
                    { name: "allergyPainkillers", label: "Schmerzmittel" },
                    { name: "allergyMetals", label: "Metalle" },
                ]}
            />

            <div className="rounded-xl border border-black/10 p-4">
                <TextField
                    name="allergyNotes"
                    label="Details (optional)"
                    placeholder="Welche Allergie, welche Reaktion, etc."
                />
                <div className="mt-4">
                    <TextField
                        name="weightKg"
                        label="Körpergewicht (kg, optional)"
                        type="number"
                        placeholder="z. B. 70"
                    />
                </div>
            </div>
        </div>
    );
}
