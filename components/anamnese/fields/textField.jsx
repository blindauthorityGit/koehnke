"use client";
import { useFormContext } from "react-hook-form";

export default function TextField({ name, label, type = "text", placeholder, required = false }) {
    const {
        register,
        formState: { errors },
    } = useFormContext();

    const err = errors?.[name]?.message;

    return (
        <label className="block">
            <div className={`mb-1 text-sm font-medium ${err ? "text-red-700" : ""}`}>
                {label}
                {required && <span className="text-red-600"> *</span>}
            </div>

            <input
                {...register(name)}
                data-field={name}
                type={type}
                placeholder={placeholder}
                className={[
                    "w-full rounded-xl border px-3 py-2 text-sm outline-none transition",
                    "focus:ring-2 focus:ring-[#0B2A4A]/25 focus:border-[#0B2A4A]/40",
                    err ? "border-red-400 bg-red-50/40" : "border-black/15 bg-white",
                ].join(" ")}
            />

            {err && <div className="mt-1 text-xs text-red-700">{typeof err === "string" ? err : "Bitte prüfen"}</div>}
        </label>
    );
}
