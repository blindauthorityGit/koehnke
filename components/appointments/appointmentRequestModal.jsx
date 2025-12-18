import { useEffect, useId, useRef, useState } from "react";
import { IoClose } from "react-icons/io5";
import { BsTelephone, BsCalendar2Check } from "react-icons/bs";

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

export default function AppointmentRequestModal({
    isOpen,
    onClose,
    endpoint = "/api/appointments/request",
    phoneDisplay = "06190-989500",
    phoneHref = "tel:06190989500",
}) {
    const titleId = useId();
    const descId = useId();
    const firstInputRef = useRef(null);
    const lastActiveElRef = useRef(null);

    const [form, setForm] = useState(DEFAULT_FORM);
    const [status, setStatus] = useState({ state: "idle", message: "" });
    const [errors, setErrors] = useState({});

    useEffect(() => {
        if (!isOpen) return;

        lastActiveElRef.current = document.activeElement;
        setStatus({ state: "idle", message: "" });
        setErrors({});

        const t = setTimeout(() => firstInputRef.current?.focus(), 0);

        const onKeyDown = (e) => {
            if (e.key === "Escape") onClose?.();
            if (e.key === "Tab") trapTab(e);
        };

        document.addEventListener("keydown", onKeyDown);

        return () => {
            clearTimeout(t);
            document.removeEventListener("keydown", onKeyDown);
            lastActiveElRef.current?.focus?.();
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isOpen]);

    function trapTab(e) {
        const modal = document.getElementById("appointment-modal-root");
        if (!modal) return;
        const focusable = modal.querySelectorAll(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        const list = Array.from(focusable).filter((el) => !el.hasAttribute("disabled"));
        if (!list.length) return;

        const first = list[0];
        const last = list[list.length - 1];

        if (e.shiftKey && document.activeElement === first) {
            e.preventDefault();
            last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
            e.preventDefault();
            first.focus();
        }
    }

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

            setTimeout(() => onClose?.(), 900);
        } catch (err) {
            setStatus({
                state: "error",
                message:
                    err?.message ||
                    "Leider ist ein Fehler passiert. Bitte rufen Sie uns an oder versuchen Sie es später erneut.",
            });
        }
    }

    if (!isOpen) return null;

    return (
        <div
            className="fixed inset-0 z-[999] flex items-center justify-center px-4 py-6"
            role="dialog"
            aria-modal="true"
            aria-labelledby={titleId}
            aria-describedby={descId}
        >
            {/* Backdrop */}
            <button
                type="button"
                aria-label="Schließen"
                onClick={onClose}
                className="absolute inset-0 bg-black/40 backdrop-blur-[2px]"
            />

            {/* Dialog */}
            <div
                id="appointment-modal-root"
                className="
          relative w-full max-w-2xl overflow-hidden
          rounded-[28px] bg-white shadow-2xl
          ring-1 ring-black/10
        "
            >
                {/* Header (CI Look) */}
                <div className="relative bg-primary-50 px-6 pb-5 pt-6">
                    <div className="flex items-start justify-between gap-4">
                        <div className="min-w-0">
                            <div className="flex items-center gap-3">
                                <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white ring-1 ring-black/10">
                                    <BsCalendar2Check className="h-5 w-5 text-delft" />
                                </div>
                                <h2 id={titleId} className="text-xl font-semibold text-delft">
                                    Termin vereinbaren
                                </h2>
                            </div>

                            <p id={descId} className="mt-3 text-sm leading-relaxed text-delft/80">
                                Für eine schnelle Terminabstimmung empfehlen wir die{" "}
                                <span className="font-semibold text-delft">telefonische Terminvereinbarung</span>.
                                Alternativ können Sie unten eine Anfrage senden.
                            </p>
                        </div>

                        {/* Close Icon */}
                        <button
                            type="button"
                            onClick={onClose}
                            className="
                inline-flex h-10 w-10 items-center justify-center
                rounded-full bg-white text-delft
                ring-1 ring-black/10
                hover:bg-black/5 focus:outline-none focus:ring-2 focus:ring-black/20
              "
                            aria-label="Modal schließen"
                        >
                            <IoClose className="h-6 w-6" />
                        </button>
                    </div>

                    {/* Phone CTA */}
                    <div
                        className="
              mt-5 flex flex-col gap-3 rounded-2xl bg-white/80 p-4
              ring-1 ring-black/10
              md:flex-row md:items-center md:justify-between
            "
                    >
                        <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-primary-50 ring-1 ring-black/10">
                                <BsTelephone className="h-5 w-5 text-delft" />
                            </div>
                            <div className="leading-tight">
                                <div className="text-sm font-semibold text-delft">Telefonisch bevorzugt</div>
                                <div className="text-sm text-delft/80">
                                    Rufen Sie uns an – wir finden sofort einen Termin.
                                </div>
                            </div>
                        </div>

                        <a
                            href={phoneHref}
                            className="
                inline-flex items-center justify-center
                rounded-full bg-delft px-5 py-3 text-sm font-semibold text-white
                hover:bg-delft/90 focus:outline-none focus:ring-2 focus:ring-black/20
              "
                        >
                            {phoneDisplay}
                        </a>
                    </div>
                </div>

                {/* Body */}
                <form onSubmit={onSubmit} className="px-6 py-6">
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

                            {errors.preferredDays && (
                                <p className="mt-1 text-xs text-red-600">{errors.preferredDays}</p>
                            )}
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
            </div>
        </div>
    );
}
