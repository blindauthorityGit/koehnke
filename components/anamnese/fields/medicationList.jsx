"use client";
import { useWatch, useFormContext } from "react-hook-form";
import CheckboxField from "./checkboxField";

export default function MedicationList() {
    const { setValue } = useFormContext();
    const takesMedication = useWatch({ name: "takesMedication" });
    const medications = useWatch({ name: "medications" }) || [];

    const add = () => setValue("medications", [...medications, { name: "", since: "" }], { shouldValidate: true });
    const remove = (idx) =>
        setValue(
            "medications",
            medications.filter((_, i) => i !== idx),
            { shouldValidate: true }
        );

    const update = (idx, key, val) => {
        const next = [...medications];
        next[idx] = { ...next[idx], [key]: val };
        setValue("medications", next, { shouldValidate: true });
    };

    return (
        <div className="space-y-3 rounded-xl border border-black/10 p-4">
            <CheckboxField name="takesMedication" label="Ich nehme regelmäßig / aktuell Medikamente" />

            {takesMedication && (
                <div className="space-y-3">
                    <div className="flex items-center justify-between">
                        <div className="text-sm font-medium">
                            Welche Medikamente nehmen Sie regelmäßig bzw. zurzeit?
                        </div>
                        <button
                            type="button"
                            onClick={add}
                            className="rounded-lg border border-black/15 px-3 py-1.5 text-xs"
                        >
                            + hinzufügen
                        </button>
                    </div>

                    {medications.length === 0 && (
                        <div className="text-xs opacity-70">Bitte mindestens ein Medikament hinzufügen.</div>
                    )}

                    {medications.map((m, idx) => (
                        <div key={idx} className="grid grid-cols-1 gap-2 md:grid-cols-[1fr_220px_auto] md:items-center">
                            <input
                                value={m.name || ""}
                                onChange={(e) => update(idx, "name", e.target.value)}
                                className="w-full rounded-xl border border-black/15 px-3 py-2 text-sm outline-none"
                                placeholder="Medikament (Name/Dosierung)"
                            />
                            <input
                                value={m.since || ""}
                                onChange={(e) => update(idx, "since", e.target.value)}
                                className="w-full rounded-xl border border-black/15 px-3 py-2 text-sm outline-none"
                                placeholder="Seit? (optional)"
                            />
                            <button
                                type="button"
                                onClick={() => remove(idx)}
                                className="rounded-xl border border-black/15 px-3 py-2 text-sm"
                            >
                                ✕
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
