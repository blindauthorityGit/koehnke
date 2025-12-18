"use client";
import { useWatch } from "react-hook-form";
import TextField from "../fields/textField";
import CheckboxField from "../fields/checkboxField";

export default function StepBase() {
    const hasSupplementaryInsurance = useWatch({ name: "hasSupplementaryInsurance" });

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <TextField name="firstName" label="Vorname*" />
                <TextField name="lastName" label="Nachname*" />
                <TextField name="birthDate" label="Geburtsdatum*" type="date" />
                <TextField name="phone" label="Telefon*" />
                <TextField name="email" label="E-Mail*" type="email" />
                <TextField name="insurance" label="Krankenkasse*" />
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                <TextField name="street" label="Straße / Nr.*" />
                <TextField name="zip" label="PLZ*" />
                <TextField name="city" label="Ort*" />
            </div>

            <div className="space-y-3 rounded-xl border border-black/10 p-4">
                <CheckboxField name="hasSupplementaryInsurance" label="Ich habe eine Zusatzversicherung" />
                {hasSupplementaryInsurance && (
                    <div className="mt-3">
                        <TextField name="supplementaryInsuranceName" label="Welche Versicherungsgesellschaft?*" />
                    </div>
                )}
            </div>
        </div>
    );
}
