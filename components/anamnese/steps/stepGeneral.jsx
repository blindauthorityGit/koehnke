"use client";
import { useWatch } from "react-hook-form";
import CheckboxField from "../fields/checkboxField";
import TextField from "../fields/textField";

export default function StepGeneral() {
    const pacemaker = useWatch({ name: "pacemaker" });
    const diabetes = useWatch({ name: "diabetes" });

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                <CheckboxField name="highBloodPressure" label="Hoher Blutdruck" />
                <CheckboxField name="lowBloodPressure" label="Niedriger Blutdruck" />
                <CheckboxField name="pacemaker" label="Herzschrittmacher" />
                <CheckboxField name="diabetes" label="Diabetes / Zuckerkrankheit" />
            </div>

            {pacemaker && (
                <div className="rounded-xl border border-black/10 p-4">
                    <TextField
                        name="pacemakerDetails"
                        label="Bitte kurz erläutern (Herzschrittmacher)*"
                        placeholder="z. B. seit wann, Typ, Besonderheiten"
                    />
                </div>
            )}

            {diabetes && (
                <div className="rounded-xl border border-black/10 p-4">
                    <TextField
                        name="diabetesDetails"
                        label="Bitte kurz erläutern (Diabetes)*"
                        placeholder="z. B. Typ, Insulin/Medikation"
                    />
                </div>
            )}
        </div>
    );
}
