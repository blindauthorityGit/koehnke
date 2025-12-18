// pages/bewerben/[job].jsx
import { useMemo, useState } from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import Image from "next/image";

import { sanityClient } from "@/client";
import { urlFor } from "@/function/urlFor"; // habt ihr ja bereits im Projekt
// optional: wenn ihr eure eigene SEO-Komponente nutzt, könnt ihr das später ersetzen

// --- GROQ Queries (KORREKT für jobPosting) ---
const jobPostingSlugsQuery = `
  *[_type == "jobPosting" && defined(slug.current)]{
    "slug": slug.current
  }
`;

const singleJobPostingQuery = `
  *[_type == "jobPosting" && slug.current == $slug][0]{
    _id,
    title,
    teaser,
    slug,
    image,
    tasks,
    profile,
    benefits,
    seo
  }
`;

export async function getStaticPaths() {
    const slugs = await sanityClient.fetch(jobPostingSlugsQuery);

    const paths = (slugs || []).filter((s) => s?.slug).map((s) => ({ params: { job: s.slug } })) || [];

    return { paths, fallback: "blocking" };
}

export async function getStaticProps({ params }) {
    const jobPosting = await sanityClient.fetch(singleJobPostingQuery, {
        slug: params?.job,
    });

    if (!jobPosting) return { notFound: true };

    return {
        props: { jobPosting },
        revalidate: 60,
    };
}

// --- Helpers ---
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function formatFileName(file) {
    if (!file) return "";
    return `${file.name} (${Math.round(file.size / 1024)} KB)`;
}

function Field({ label, required, error, children }) {
    return (
        <div className="mb-5">
            <label className="mb-2 block text-sm font-medium text-slate-900">
                {label} {required ? <span className="text-slate-500">*</span> : null}
            </label>
            {children}
            {error ? <p className="mt-2 text-sm text-red-600">{error}</p> : null}
        </div>
    );
}

function Input({ value, onChange, ...props }) {
    return (
        <input
            value={value}
            onChange={(e) => onChange?.(e.target.value)}
            className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-slate-400"
            {...props}
        />
    );
}

function Textarea({ value, onChange, ...props }) {
    return (
        <textarea
            value={value}
            onChange={(e) => onChange?.(e.target.value)}
            className="min-h-[140px] w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-slate-400"
            {...props}
        />
    );
}

function Select({ value, onChange, children, ...props }) {
    return (
        <select
            value={value}
            onChange={(e) => onChange?.(e.target.value)}
            className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-slate-400"
            {...props}
        >
            {children}
        </select>
    );
}

function StepPill({ active, done, children }) {
    return (
        <div
            className={[
                "rounded-full px-3 py-1 text-xs font-medium",
                done
                    ? "bg-slate-900 text-white"
                    : active
                    ? "bg-slate-200 text-slate-900"
                    : "bg-slate-100 text-slate-500",
            ].join(" ")}
        >
            {children}
        </div>
    );
}

function ListPreview({ title, items }) {
    if (!Array.isArray(items) || items.length === 0) return null;
    return (
        <div className="rounded-2xl border border-slate-200 bg-white p-4">
            <p className="text-sm font-semibold text-slate-900">{title}</p>
            <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-slate-700">
                {items.slice(0, 4).map((it) => (
                    <li key={it._key || it.text}>{it.text}</li>
                ))}
            </ul>
        </div>
    );
}

export default function ApplyPage({ jobPosting }) {
    const router = useRouter();
    const ref = typeof router.query?.ref === "string" ? router.query.ref : "";

    // Steps: 0 Kontakt, 1 Eckdaten, 2 Uploads, 3 Review
    const [step, setStep] = useState(0);
    const [submitting, setSubmitting] = useState(false);
    const [submitError, setSubmitError] = useState("");
    const [errors, setErrors] = useState({});

    // --- Form State ---
    const [form, setForm] = useState({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        city: "",

        startDate: "",
        startASAP: false,
        employmentType: "",
        hoursPerWeek: "",
        message: "",
        experience: "",

        privacyAccepted: false,
    });

    // --- Files ---
    const [cvFile, setCvFile] = useState(null); // required
    const [coverFile, setCoverFile] = useState(null); // optional
    const [attachmentFiles, setAttachmentFiles] = useState([]); // optional

    const employmentOptions = useMemo(() => ["Teilzeit", "Vollzeit", "Minijob", "Ausbildung"], []);

    const stepTitles = ["Kontakt", "Eckdaten", "Uploads", "Review"];

    const heroImgUrl = jobPosting?.image
        ? urlFor(jobPosting.image.asset || jobPosting.image)
              .width(1400)
              .height(800)
              .url()
        : null;

    const isDecorative = jobPosting?.image?.isDecorative;
    const imageAlt = isDecorative ? "" : jobPosting?.image?.alt || jobPosting?.title || "";

    function updateField(key, value) {
        setForm((prev) => ({ ...prev, [key]: value }));
    }

    function validateStep(currentStep) {
        const e = {};

        if (currentStep === 0) {
            if (!form.firstName.trim()) e.firstName = "Bitte Vornamen angeben.";
            if (!form.lastName.trim()) e.lastName = "Bitte Nachnamen angeben.";
            if (!form.email.trim()) e.email = "Bitte E-Mail angeben.";
            if (form.email && !emailRegex.test(form.email)) e.email = "Bitte gültige E-Mail angeben.";
            if (!form.phone.trim()) e.phone = "Bitte Telefonnummer angeben.";
            if (!form.city.trim()) e.city = "Bitte Wohnort (PLZ/Ort) angeben.";
        }

        if (currentStep === 1) {
            if (!form.startASAP && !form.startDate)
                e.startDate = "Bitte Startdatum wählen oder „ab sofort“ aktivieren.";
            if (!form.employmentType) e.employmentType = "Bitte Beschäftigungsart wählen.";
            if (!form.message.trim()) e.message = "Bitte kurz beschreiben, warum du dich bewirbst.";
        }

        if (currentStep === 2) {
            if (!cvFile) e.cvFile = "Bitte Lebenslauf als PDF hochladen.";
            if (cvFile && cvFile.type && cvFile.type !== "application/pdf") {
                e.cvFile = "Lebenslauf bitte als PDF hochladen.";
            }
        }

        if (currentStep === 3) {
            if (!form.privacyAccepted) e.privacyAccepted = "Bitte Datenschutz-Einwilligung bestätigen.";
        }

        return e;
    }

    function nextStep() {
        const e = validateStep(step);
        setErrors(e);
        if (Object.keys(e).length === 0) setStep((s) => Math.min(s + 1, 3));
    }

    function prevStep() {
        setSubmitError("");
        setStep((s) => Math.max(s - 1, 0));
    }

    async function handleSubmit() {
        const e = validateStep(3);
        setErrors(e);
        if (Object.keys(e).length) return;

        setSubmitting(true);
        setSubmitError("");

        try {
            const fd = new FormData();

            // Job context
            fd.append("jobPostingId", jobPosting?._id || "");
            fd.append("jobSlug", jobPosting?.slug?.current || router.query.job || "");
            fd.append("jobTitle", jobPosting?.title || "");

            // Meta
            if (ref) fd.append("ref", ref);

            // Applicant + details
            fd.append("firstName", form.firstName);
            fd.append("lastName", form.lastName);
            fd.append("email", form.email);
            fd.append("phone", form.phone);
            fd.append("city", form.city);

            fd.append("startASAP", String(!!form.startASAP));
            fd.append("startDate", form.startDate || "");
            fd.append("employmentType", form.employmentType || "");
            fd.append("hoursPerWeek", form.hoursPerWeek || "");
            fd.append("message", form.message || "");
            fd.append("experience", form.experience || "");

            // Consent
            fd.append("privacyAccepted", String(!!form.privacyAccepted));

            // Files
            if (cvFile) fd.append("cv", cvFile, cvFile.name);
            if (coverFile) fd.append("coverLetter", coverFile, coverFile.name);
            for (const f of attachmentFiles) fd.append("attachments", f, f.name);
            const res = await fetch("/api/applications/create", {
                method: "POST",
                body: fd,
            });

            let json;
            try {
                json = await res.json();
            } catch {
                throw new Error("Ungültige Server-Antwort.");
            }

            if (!res.ok || !json?.ok) {
                throw new Error(json?.error || "Serverfehler beim Senden der Bewerbung.");
            }

            // optional: ID weiterreichen (für Tracking / Debug)
            router.push({
                pathname: "/karriere/bewerben/danke",
                query: { id: json.id },
            });
        } catch (err) {
            setSubmitError(err?.message || "Unbekannter Fehler.");
        } finally {
            setSubmitting(false);
        }
    }

    return (
        <>
            <Head>
                <title>Bewerbung – {jobPosting?.title || "Online Bewerbung"}</title>
                <meta name="robots" content="noindex,nofollow" />
            </Head>

            <main className="relative z-10">
                <section className="mx-auto max-w-4xl px-4 py-10 md:py-14">
                    {/* Header */}
                    {/* HEADER: 2 Spalten */}
                    <div className="mb-10 grid gap-8 lg:grid-cols-[1.2fr_0.8fr] lg:items-start">
                        {/* Links: Titel + Teaser */}
                        <div>
                            <p className="mb-3 inline-flex rounded-full bg-slate-100 px-4 py-2 text-xs font-medium text-slate-700">
                                Online-Bewerbung
                            </p>

                            <h1 className="text-3xl font-semibold tracking-tight text-slate-900 md:text-4xl">
                                Bewerbung als {jobPosting?.title || "—"}
                            </h1>

                            <p className="mt-4 max-w-2xl text-base leading-relaxed text-slate-600">
                                {jobPosting?.teaser ||
                                    "Bitte fülle das Formular aus und lade deine Unterlagen hoch. Wir melden uns zeitnah."}
                            </p>
                        </div>

                        {/* Rechts: Bild */}
                        {heroImgUrl ? (
                            <div className="overflow-hidden rounded-[28px] border border-slate-200 bg-slate-50">
                                <div className="relative aspect-[4/3] w-full">
                                    <Image
                                        src={heroImgUrl}
                                        alt={imageAlt}
                                        fill
                                        sizes="(max-width: 768px) 100vw, 40vw"
                                        className="object-cover"
                                        priority
                                    />
                                </div>
                            </div>
                        ) : null}
                    </div>

                    {/* BLOCKS: volle Breite darunter */}
                    <div className="mb-10 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                        <ListPreview title="Aufgaben" items={jobPosting?.tasks} />
                        <ListPreview title="Profil" items={jobPosting?.profile} />
                        <ListPreview title="Benefits" items={jobPosting?.benefits} />
                    </div>

                    {/* Step Pills */}
                    <div className="mb-8 flex flex-wrap gap-2">
                        {stepTitles.map((t, idx) => (
                            <StepPill key={t} active={idx === step} done={idx < step}>
                                {idx + 1}. {t}
                            </StepPill>
                        ))}
                    </div>

                    {/* Card */}
                    <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm md:p-8">
                        {/* Step 0 */}
                        {step === 0 && (
                            <>
                                <h2 className="mb-6 text-xl font-semibold text-slate-900">Kontakt</h2>

                                <div className="grid gap-5 md:grid-cols-2">
                                    <Field label="Vorname" required error={errors.firstName}>
                                        <Input
                                            value={form.firstName}
                                            onChange={(v) => updateField("firstName", v)}
                                            placeholder="Max"
                                            autoComplete="given-name"
                                        />
                                    </Field>

                                    <Field label="Nachname" required error={errors.lastName}>
                                        <Input
                                            value={form.lastName}
                                            onChange={(v) => updateField("lastName", v)}
                                            placeholder="Mustermann"
                                            autoComplete="family-name"
                                        />
                                    </Field>
                                </div>

                                <div className="grid gap-5 md:grid-cols-2">
                                    <Field label="E-Mail" required error={errors.email}>
                                        <Input
                                            value={form.email}
                                            onChange={(v) => updateField("email", v)}
                                            placeholder="max@beispiel.at"
                                            autoComplete="email"
                                            inputMode="email"
                                        />
                                    </Field>

                                    <Field label="Telefon" required error={errors.phone}>
                                        <Input
                                            value={form.phone}
                                            onChange={(v) => updateField("phone", v)}
                                            placeholder="+43 ..."
                                            autoComplete="tel"
                                            inputMode="tel"
                                        />
                                    </Field>
                                </div>

                                <Field label="Wohnort (PLZ/Ort)" required error={errors.city}>
                                    <Input
                                        value={form.city}
                                        onChange={(v) => updateField("city", v)}
                                        placeholder="z. B. 1010 Wien"
                                        autoComplete="address-level2"
                                    />
                                </Field>
                            </>
                        )}

                        {/* Step 1 */}
                        {step === 1 && (
                            <>
                                <h2 className="mb-6 text-xl font-semibold text-slate-900">Eckdaten</h2>

                                <div className="mb-6 rounded-2xl bg-slate-50 p-4">
                                    <label className="flex items-center gap-3 text-sm text-slate-800">
                                        <input
                                            type="checkbox"
                                            checked={form.startASAP}
                                            onChange={(e) => updateField("startASAP", e.target.checked)}
                                            className="h-4 w-4"
                                        />
                                        Ich kann ab sofort starten
                                    </label>
                                </div>

                                <Field label="Frühester Starttermin" required error={errors.startDate}>
                                    <Input
                                        value={form.startDate}
                                        onChange={(v) => updateField("startDate", v)}
                                        type="date"
                                        disabled={form.startASAP}
                                    />
                                </Field>

                                <Field label="Beschäftigungsart" required error={errors.employmentType}>
                                    <Select
                                        value={form.employmentType}
                                        onChange={(v) => updateField("employmentType", v)}
                                    >
                                        <option value="">Bitte wählen…</option>
                                        {employmentOptions.map((opt) => (
                                            <option key={opt} value={opt}>
                                                {opt}
                                            </option>
                                        ))}
                                    </Select>
                                </Field>

                                <Field label="Wochenstunden (optional)">
                                    <Input
                                        value={form.hoursPerWeek}
                                        onChange={(v) => updateField("hoursPerWeek", v)}
                                        placeholder="z. B. 20"
                                        inputMode="numeric"
                                    />
                                </Field>

                                <Field label="Kurze Nachricht" required error={errors.message}>
                                    <Textarea
                                        value={form.message}
                                        onChange={(v) => updateField("message", v)}
                                        placeholder="Kurz: warum du, warum diese Stelle? (ein paar Sätze reichen)"
                                    />
                                </Field>

                                <Field label="Berufserfahrung (optional)">
                                    <Textarea
                                        value={form.experience}
                                        onChange={(v) => updateField("experience", v)}
                                        placeholder="z. B. 3 Jahre Praxis, spezielle Kenntnisse, etc."
                                    />
                                </Field>
                            </>
                        )}

                        {/* Step 2 */}
                        {step === 2 && (
                            <>
                                <h2 className="mb-6 text-xl font-semibold text-slate-900">Uploads</h2>

                                <Field label="Lebenslauf (PDF)" required error={errors.cvFile}>
                                    <input
                                        type="file"
                                        accept="application/pdf"
                                        onChange={(e) => setCvFile(e.target.files?.[0] || null)}
                                        className="block w-full text-sm text-slate-700 file:mr-4 file:rounded-xl file:border-0 file:bg-slate-900 file:px-4 file:py-3 file:text-sm file:font-medium file:text-white"
                                    />
                                    {cvFile ? (
                                        <p className="mt-2 text-sm text-slate-600">{formatFileName(cvFile)}</p>
                                    ) : null}
                                </Field>

                                <Field label="Motivationsschreiben (optional, PDF)">
                                    <input
                                        type="file"
                                        accept="application/pdf"
                                        onChange={(e) => setCoverFile(e.target.files?.[0] || null)}
                                        className="block w-full text-sm text-slate-700 file:mr-4 file:rounded-xl file:border-0 file:bg-slate-200 file:px-4 file:py-3 file:text-sm file:font-medium file:text-slate-900"
                                    />
                                    {coverFile ? (
                                        <p className="mt-2 text-sm text-slate-600">{formatFileName(coverFile)}</p>
                                    ) : null}
                                </Field>

                                <Field label="Weitere Anhänge (optional, PDFs)">
                                    <input
                                        type="file"
                                        accept="application/pdf"
                                        multiple
                                        onChange={(e) => setAttachmentFiles(Array.from(e.target.files || []))}
                                        className="block w-full text-sm text-slate-700 file:mr-4 file:rounded-xl file:border-0 file:bg-slate-200 file:px-4 file:py-3 file:text-sm file:font-medium file:text-slate-900"
                                    />
                                    {attachmentFiles?.length ? (
                                        <ul className="mt-2 space-y-1 text-sm text-slate-600">
                                            {attachmentFiles.map((f) => (
                                                <li key={f.name}>{formatFileName(f)}</li>
                                            ))}
                                        </ul>
                                    ) : null}
                                </Field>

                                <div className="rounded-2xl bg-slate-50 p-4 text-sm text-slate-700">
                                    Tipp: Bitte bevorzugt PDFs hochladen. Falls du gerade kein Motivationsschreiben
                                    hast, ist das kein Problem.
                                </div>
                            </>
                        )}

                        {/* Step 3 */}
                        {step === 3 && (
                            <>
                                <h2 className="mb-6 text-xl font-semibold text-slate-900">Review</h2>

                                <div className="space-y-4">
                                    <div className="rounded-2xl border border-slate-200 p-4">
                                        <p className="text-sm font-medium text-slate-900">Kontakt</p>
                                        <p className="mt-2 text-sm text-slate-700">
                                            {form.firstName} {form.lastName}
                                            <br />
                                            {form.email} · {form.phone}
                                            <br />
                                            {form.city}
                                        </p>
                                    </div>

                                    <div className="rounded-2xl border border-slate-200 p-4">
                                        <p className="text-sm font-medium text-slate-900">Eckdaten</p>
                                        <p className="mt-2 text-sm text-slate-700">
                                            Start: {form.startASAP ? "ab sofort" : form.startDate || "—"}
                                            <br />
                                            Art: {form.employmentType || "—"}
                                            <br />
                                            Stunden: {form.hoursPerWeek || "—"}
                                        </p>

                                        <p className="mt-3 text-sm text-slate-700">
                                            <span className="font-medium">Nachricht:</span>
                                            <br />
                                            {form.message || "—"}
                                        </p>

                                        {form.experience ? (
                                            <p className="mt-3 text-sm text-slate-700">
                                                <span className="font-medium">Erfahrung:</span>
                                                <br />
                                                {form.experience}
                                            </p>
                                        ) : null}
                                    </div>

                                    <div className="rounded-2xl border border-slate-200 p-4">
                                        <p className="text-sm font-medium text-slate-900">Uploads</p>
                                        <ul className="mt-2 space-y-1 text-sm text-slate-700">
                                            <li>Lebenslauf: {cvFile ? formatFileName(cvFile) : "—"}</li>
                                            <li>Motivationsschreiben: {coverFile ? formatFileName(coverFile) : "—"}</li>
                                            <li>
                                                Weitere Anhänge:{" "}
                                                {attachmentFiles?.length ? `${attachmentFiles.length} Datei(en)` : "—"}
                                            </li>
                                        </ul>
                                    </div>

                                    <div className="rounded-2xl bg-slate-50 p-4">
                                        <label className="flex items-start gap-3 text-sm text-slate-800">
                                            <input
                                                type="checkbox"
                                                checked={form.privacyAccepted}
                                                onChange={(e) => updateField("privacyAccepted", e.target.checked)}
                                                className="mt-1 h-4 w-4"
                                            />
                                            <span>
                                                Ich habe die Datenschutzhinweise gelesen und willige ein, dass meine
                                                Angaben zur Bearbeitung der Bewerbung verarbeitet werden.
                                            </span>
                                        </label>
                                        {errors.privacyAccepted ? (
                                            <p className="mt-2 text-sm text-red-600">{errors.privacyAccepted}</p>
                                        ) : null}
                                    </div>

                                    {submitError ? (
                                        <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
                                            {submitError}
                                        </div>
                                    ) : null}
                                </div>
                            </>
                        )}

                        {/* Footer Buttons */}
                        <div className="mt-8 flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between">
                            <button
                                type="button"
                                onClick={prevStep}
                                disabled={step === 0 || submitting}
                                className="rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-medium text-slate-900 transition disabled:opacity-40"
                            >
                                Zurück
                            </button>

                            {step < 3 ? (
                                <button
                                    type="button"
                                    onClick={nextStep}
                                    disabled={submitting}
                                    className="rounded-xl bg-slate-900 px-5 py-3 text-sm font-medium text-white transition hover:opacity-95 disabled:opacity-60"
                                >
                                    Weiter
                                </button>
                            ) : (
                                <button
                                    type="button"
                                    onClick={handleSubmit}
                                    disabled={submitting}
                                    className="rounded-xl bg-slate-900 px-5 py-3 text-sm font-medium text-white transition hover:opacity-95 disabled:opacity-60"
                                >
                                    {submitting ? "Wird gesendet…" : "Bewerbung absenden"}
                                </button>
                            )}
                        </div>
                    </div>

                    <p className="mt-6 text-center text-xs text-slate-500">
                        Hinweis: Bitte keine sensiblen Daten, die für die Bewerbung nicht notwendig sind.
                    </p>
                </section>
            </main>
        </>
    );
}
