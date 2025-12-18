"use client";
import CheckboxField from "../fields/checkboxField";
import TextField from "../fields/textField";

export default function StepSpecial() {
    return (
        <div className="space-y-6">
            <CheckboxField name="pregnant" label="Besteht eine Schwangerschaft?" />
            <TextField name="weightKg" label="Körpergewicht (kg, optional)" type="number" placeholder="z. B. 70" />
        </div>
    );
}
