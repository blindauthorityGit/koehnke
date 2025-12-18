"use client";
import { useFormContext } from "react-hook-form";

export default function CheckboxField({ name, label, required = false }) {
    const {
        register,
        formState: { errors },
    } = useFormContext();

    const err = errors?.[name]?.message;

    return (
        <label className="flex items-start gap-3">
            <input
                {...register(name)}
                data-field={name}
                type="checkbox"
                className={`mt-1 h-4 w-4 rounded border border-black/20 outline-none focus:ring-2 focus:ring-[#0B2A4A]/30 ${
                    err ? "ring-2 ring-red-400" : ""
                }`}
            />

            <div className="text-sm">
                <div className={`font-medium ${err ? "text-red-700" : ""}`}>
                    {label}
                    {required && <span className="text-red-600"> *</span>}
                </div>

                {err && (
                    <div className="mt-1 text-xs text-red-700">{typeof err === "string" ? err : "Bitte prüfen"}</div>
                )}
            </div>
        </label>
    );
}
