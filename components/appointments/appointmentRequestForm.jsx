import { useEffect, useRef, useState } from "react";

const DEFAULT_FORM = {
    firstName: "",
    lastName: "",
    phone: "",
    email: "",
    reason: "Kontrolle",
    preferredDays: [],
    preferredTime: "Vormittag",
    message: "",
    consentPrivacy: false,
    consentContact: true,
    website: "", // honeypot
};

const DAYS = ["Mo", "Di", "Mi", "Do", "Fr"];
const REASONS = ["Kontrolle", "Prophylaxe", "Schmerzen / Notfall", "Beratung", "Ästhetik", "Sonstiges"];

function cn(...xs) {
    return xs.filter(Boolean).join(" ");
}

export default function AppointmentRequestForm({
    endpoint = "/api/appointments/request",
    onClose = null, // im Modal: schließen; auf Seite: kann null sein
    autoFocus = false, // im Modal true, auf Seite false
    closeOnSuccess = true, // im Modal true, auf Seite eher false
    successCloseDelay = 900,
    onSuccess = null, // optional callback (analytics etc.)
}) {
    const firstInputRef = useRef(null);

    const [form, setForm] = useState(DEFAULT_FORM);
    const [status, setStatus] = useState({ state: "idle", message: "" });
    const [errors, setErrors] = useState({});

    useEffect(() => {
        if (!autoFocus) return;
        const t = setTimeout(() => firstInputRef.current?.focus(), 0);
        return () => clearTimeout(t);
    }, [autoFocus]);

    function updateField(name, value) {
        setForm((prev) => ({ ...prev, [name]: value }));
    }

    function toggleDay(day) {
        setForm((prev) => {
            const has = prev.preferredDays.includes(day);
            return {
                ...prev,
                preferredDays: has ? prev.preferredDays.filter((d) => d !== day) : [...prev.preferredDays, day],
            };
        });
    }

    function validate(data) {
        const e = {};
        if (!data.firstName.trim()) e.firstName = "Bitte Vornamen eingeben.";
        if (!data.lastName.trim()) e.lastName = "Bitte Nachnamen eingeben.";

        const phone = data.phone.trim();
        if (!phone) e.phone = "Bitte Telefonnummer eingeben.";
        else if (phone.length < 6) e.phone = "Telefonnummer wirkt zu kurz.";

        const email = data.email.trim();
        if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) e.email = "Bitte gültige E-Mail eingeben.";

        if (!data.consentPrivacy) e.consentPrivacy = "Bitte Datenschutzhinweis akzeptieren.";
        if (!Array.isArray(data.preferredDays) || data.preferredDays.length === 0) {
            e.preferredDays = "Bitte mindestens einen Wunschtag auswählen.";
        }

        if (data.website && data.website.trim().length > 0) e.website = "Spam erkannt.";
        return e;
    }

    async function onSubmit(e) {
        e.preventDefault();
        setStatus({ state: "idle", message: "" });

        const v = validate(form);
        setErrors(v);
        if (Object.keys(v).length) return;

        setStatus({ state: "sending", message: "Wird gesendet…" });

        try {
            const res = await fetch(endpoint, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(form),
            });

            const payload = await res.json().catch(() => ({}));
            if (!res.ok) throw new Error(payload?.message || "Senden fehlgeschlagen.");

            setStatus({
                state: "success",
                message: "Danke! Ihre Anfrage ist eingegangen. Wir melden uns zeitnah zur Bestätigung.",
            });
            setForm(DEFAULT_FORM);

            if (onSuccess) onSuccess();

            if (closeOnSuccess && onClose) {
                setTimeout(() => onClose?.(), successCloseDelay);
            }
        } catch (err) {
            setStatus({
                state: "error",
                message:
                    err?.message ||
                    "Leider ist ein Fehler passiert. Bitte rufen Sie uns an oder versuchen Sie es später erneut.",
            });
        }
    }

    return (
        <form onSubmit={onSubmit}>
            {/* honeypot */}
            <div className="hidden" aria-hidden="true">
                <label>
                    Website
                    <input
                        tabIndex={-1}
                        autoComplete="off"
                        value={form.website}
                        onChange={(e) => updateField("website", e.target.value)}
                    />
                </label>
            </div>

            {/* Section title */}
            <div className="mb-4 flex items-center justify-between">
                <div className="text-sm font-semibold text-delft">Terminanfrage (Alternative)</div>
                <div className="text-xs text-delft/60">Antwort telefonisch oder per E-Mail</div>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                    <label className="mb-1 block text-sm font-medium text-delft">Vorname *</label>
                    <input
                        ref={firstInputRef}
                        type="text"
                        value={form.firstName}
                        onChange={(e) => updateField("firstName", e.target.value)}
                        className={cn(
                            "w-full rounded-2xl border bg-white px-4 py-3 text-sm text-delft outline-none",
                            errors.firstName ? "border-red-400" : "border-black/10 focus:border-black/30"
                        )}
                        autoComplete="given-name"
                    />
                    {errors.firstName && <p className="mt-1 text-xs text-red-600">{errors.firstName}</p>}
                </div>

                <div>
                    <label className="mb-1 block text-sm font-medium text-delft">Nachname *</label>
                    <input
                        type="text"
                        value={form.lastName}
                        onChange={(e) => updateField("lastName", e.target.value)}
                        className={cn(
                            "w-full rounded-2xl border bg-white px-4 py-3 text-sm text-delft outline-none",
                            errors.lastName ? "border-red-400" : "border-black/10 focus:border-black/30"
                        )}
                        autoComplete="family-name"
                    />
                    {errors.lastName && <p className="mt-1 text-xs text-red-600">{errors.lastName}</p>}
                </div>

                <div>
                    <label className="mb-1 block text-sm font-medium text-delft">Telefon *</label>
                    <input
                        type="tel"
                        inputMode="tel"
                        value={form.phone}
                        onChange={(e) => updateField("phone", e.target.value)}
                        className={cn(
                            "w-full rounded-2xl border bg-white px-4 py-3 text-sm text-delft outline-none",
                            errors.phone ? "border-red-400" : "border-black/10 focus:border-black/30"
                        )}
                        autoComplete="tel"
                    />
                    {errors.phone && <p className="mt-1 text-xs text-red-600">{errors.phone}</p>}
                </div>

                <div>
                    <label className="mb-1 block text-sm font-medium text-delft">E-Mail</label>
                    <input
                        type="email"
                        value={form.email}
                        onChange={(e) => updateField("email", e.target.value)}
                        className={cn(
                            "w-full rounded-2xl border bg-white px-4 py-3 text-sm text-delft outline-none",
                            errors.email ? "border-red-400" : "border-black/10 focus:border-black/30"
                        )}
                        autoComplete="email"
                    />
                    {errors.email && <p className="mt-1 text-xs text-red-600">{errors.email}</p>}
                </div>

                <div>
                    <label className="mb-1 block text-sm font-medium text-delft">Grund</label>
                    <select
                        value={form.reason}
                        onChange={(e) => updateField("reason", e.target.value)}
                        className="w-full rounded-2xl border border-black/10 bg-white px-4 py-3 text-sm text-delft outline-none focus:border-black/30"
                    >
                        {REASONS.map((r) => (
                            <option key={r} value={r}>
                                {r}
                            </option>
                        ))}
                    </select>
                </div>

                <div>
                    <label className="mb-1 block text-sm font-medium text-delft">Uhrzeit-Präferenz</label>
                    <select
                        value={form.preferredTime}
                        onChange={(e) => updateField("preferredTime", e.target.value)}
                        className="w-full rounded-2xl border border-black/10 bg-white px-4 py-3 text-sm text-delft outline-none focus:border-black/30"
                    >
                        <option value="Vormittag">Vormittag</option>
                        <option value="Nachmittag">Nachmittag</option>
                        <option value="Egal">Egal</option>
                    </select>
                </div>

                <div className="md:col-span-2">
                    <div className="flex items-end justify-between gap-4">
                        <label className="mb-1 block text-sm font-medium text-delft">Wunschtage *</label>
                        <span className="text-xs text-delft/60">Mehrfachauswahl möglich</span>
                    </div>

                    <div className="mt-2 flex flex-wrap gap-2">
                        {DAYS.map((d) => {
                            const active = form.preferredDays.includes(d);
                            return (
                                <button
                                    key={d}
                                    type="button"
                                    onClick={() => toggleDay(d)}
                                    className={cn(
                                        "rounded-full border px-4 py-2 text-sm font-semibold transition",
                                        active
                                            ? "border-delft bg-delft text-white"
                                            : "border-black/10 bg-white text-delft hover:border-black/20 hover:bg-black/5"
                                    )}
                                    aria-pressed={active}
                                >
                                    {d}
                                </button>
                            );
                        })}
                    </div>

                    {errors.preferredDays && <p className="mt-1 text-xs text-red-600">{errors.preferredDays}</p>}
                </div>

                <div className="md:col-span-2">
                    <label className="mb-1 block text-sm font-medium text-delft">Kurze Beschreibung</label>
                    <textarea
                        value={form.message}
                        onChange={(e) => updateField("message", e.target.value)}
                        rows={4}
                        className="w-full rounded-2xl border border-black/10 bg-white px-4 py-3 text-sm text-delft outline-none focus:border-black/30"
                        placeholder="Optional: z. B. Schmerz seit wann, betroffene Region, besondere Hinweise…"
                    />
                </div>

                <div className="md:col-span-2 space-y-3 pt-1">
                    <label className="flex items-start gap-3 text-sm text-delft">
                        <input
                            type="checkbox"
                            checked={form.consentPrivacy}
                            onChange={(e) => updateField("consentPrivacy", e.target.checked)}
                            className={cn(
                                "mt-1 h-4 w-4 rounded border",
                                errors.consentPrivacy ? "border-red-400" : "border-black/30"
                            )}
                        />
                        <span>
                            Ich habe die Datenschutzhinweise gelesen und bin einverstanden. *
                            {errors.consentPrivacy && (
                                <span className="block text-xs text-red-600">{errors.consentPrivacy}</span>
                            )}
                        </span>
                    </label>

                    <label className="flex items-start gap-3 text-sm text-delft">
                        <input
                            type="checkbox"
                            checked={form.consentContact}
                            onChange={(e) => updateField("consentContact", e.target.checked)}
                            className="mt-1 h-4 w-4 rounded border border-black/30"
                        />
                        <span>Die Praxis darf mich zur Terminabstimmung kontaktieren.</span>
                    </label>
                </div>
            </div>

            {/* Footer */}
            <div className="mt-6 flex flex-col-reverse gap-3 md:flex-row md:items-center md:justify-between">
                <div className="text-sm text-delft/80" aria-live="polite">
                    {status.state === "sending" && "Wird gesendet…"}
                    {status.state === "success" && status.message}
                    {status.state === "error" && <span className="text-red-700">{status.message}</span>}
                </div>

                <div className="flex gap-3">
                    {onClose && (
                        <button
                            type="button"
                            onClick={onClose}
                            className="
                rounded-full border border-black/10 px-5 py-3 text-sm font-semibold text-delft
                hover:bg-black/5 focus:outline-none focus:ring-2 focus:ring-black/20
              "
                        >
                            Abbrechen
                        </button>
                    )}

                    <button
                        type="submit"
                        disabled={status.state === "sending"}
                        className={cn(
                            "rounded-full px-6 py-3 text-sm font-semibold text-white focus:outline-none focus:ring-2 focus:ring-black/20",
                            status.state === "sending" ? "bg-delft/60" : "bg-delft hover:bg-delft/90"
                        )}
                    >
                        Anfrage senden
                    </button>
                </div>
            </div>
        </form>
    );
}
