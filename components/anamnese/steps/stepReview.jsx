"use client";
import { useFormContext } from "react-hook-form";

function Row({ k, val }) {
    return (
        <div className="flex items-start justify-between gap-4 border-b border-black/10 py-2">
            <div className="text-sm font-medium">{k}</div>
            <div className="text-sm opacity-80 text-right">{val}</div>
        </div>
    );
}

export default function StepReview() {
    const { getValues } = useFormContext();
    const v = getValues();

    return (
        <div className="space-y-4">
            <div className="text-sm opacity-80">
                Bitte prüfen. Mit „Verbindlich absenden“ werden die Daten an die Praxis übermittelt.
            </div>

            <div className="rounded-xl border border-black/10 p-4">
                <Row k="Name" val={`${v.firstName || ""} ${v.lastName || ""}`.trim() || "-"} />
                <Row k="Geburtsdatum" val={v.birthDate || "-"} />
                <Row k="Adresse" val={`${v.street || ""}, ${v.zip || ""} ${v.city || ""}`.trim() || "-"} />
                <Row k="E-Mail" val={v.email || "-"} />
                <Row k="Telefon" val={v.phone || "-"} />
                <Row k="Krankenkasse" val={v.insurance || "-"} />
            </div>
        </div>
    );
}
