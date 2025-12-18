"use client";

import { useMemo, useState, useCallback } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AnimatePresence, motion } from "framer-motion";

import { anamnesisSchema } from "@/libs/anamnese/schema";
import { steps } from "@/libs/anamnese/steps";

import { PrimaryButton, BasicButton } from "@/components/buttons";

import StepBase from "./steps/stepBase";
import StepGeneral from "./steps/stepGeneral";
import StepMedsAllergies from "./steps/stepMedsAllergies";
import StepDental from "./steps/stepDental";
import StepSpecial from "./steps/stepSpecial";
import StepConsent from "./steps/stepConsent";
import StepReview from "./steps/stepReview";
import StepConditions from "./steps/stepConditions";
import StepInfectionTherapy from "./steps/stepInfectionTherapy";
import StepWishes from "./steps/stepWishes";
import StepThankYou from "./steps/stepThankYou";

function StepRenderer({ stepKey, submitResult }) {
    switch (stepKey) {
        case "base":
            return <StepBase />;
        case "general":
            return <StepGeneral />;
        case "medsAllergies":
            return <StepMedsAllergies />;
        case "conditions":
            return <StepConditions />;
        case "infectionTherapy":
            return <StepInfectionTherapy />;
        case "dental":
            return <StepDental />;
        case "wishes":
            return <StepWishes />;
        case "special":
            return <StepSpecial />;
        case "consent":
            return <StepConsent />;
        case "review":
            return <StepReview />;
        case "thankyou":
            return <StepThankYou submitResult={submitResult} />;
        default:
            return null;
    }
}

const BRAND = {
    primary: "#0B2A4A",
    primarySoft: "rgba(11,42,74,0.12)",
    errorSoft: "rgba(220, 38, 38, 0.08)",
};

const variants = {
    enter: (direction) => ({ x: direction > 0 ? 32 : -32, opacity: 0, filter: "blur(4px)" }),
    center: { x: 0, opacity: 1, filter: "blur(0px)", transition: { duration: 0.22, ease: [0.16, 0.6, 0.25, 1] } },
    exit: (direction) => ({
        x: direction > 0 ? -24 : 24,
        opacity: 0,
        filter: "blur(4px)",
        transition: { duration: 0.18, ease: [0.4, 0.0, 0.2, 1] },
    }),
};

function getErrorByPath(errors, path) {
    if (!errors || !path) return undefined;
    const parts = path.split(".");
    let cur = errors;
    for (const p of parts) {
        if (!cur) return undefined;
        cur = cur[p];
    }
    return cur;
}

export default function AnamneseWizard() {
    const [activeIndex, setActiveIndex] = useState(0);
    const [direction, setDirection] = useState(1);
    const [submitError, setSubmitError] = useState(null);
    const [submitResult, setSubmitResult] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const activeStep = steps[activeIndex];
    const isReview = activeStep?.key === "review";
    const isThankYou = activeStep?.key === "thankyou";

    const methods = useForm({
        resolver: zodResolver(anamnesisSchema),
        mode: "onTouched",
        criteriaMode: "firstError",
        defaultValues: {
            firstName: "",
            lastName: "",
            birthDate: "",
            email: "",
            phone: "",
            street: "",
            zip: "",
            city: "",
            insurance: "",
            hasSupplementaryInsurance: false,
            pacemaker: false,
            diabetes: false,
            takesMedication: false,
            medications: [],
            consentDataProcessing: false,
            consentRecallSystem: false,
            consentAppointmentPolicy: false,
            consentSmsReminder: false,
        },
    });

    const progress = useMemo(() => Math.round(((activeIndex + 1) / steps.length) * 100), [activeIndex]);

    const stepErrors = useMemo(() => {
        const errs = [];
        const allErrors = methods.formState.errors;

        (activeStep.fields || []).forEach((fieldPath) => {
            const err = getErrorByPath(allErrors, fieldPath);
            if (!err) return;
            const msg = typeof err?.message === "string" ? err.message : "Bitte Feld prüfen";
            errs.push({ fieldPath, message: msg });
        });

        return errs;
    }, [activeStep.fields, activeStep.key, methods.formState.errors]);

    const scrollToField = (fieldPath) => {
        const el =
            document.querySelector(`[name="${fieldPath}"]`) || document.querySelector(`[data-field="${fieldPath}"]`);

        if (!el) return;
        el.scrollIntoView({ behavior: "smooth", block: "center" });
        el.classList.add("ring-2", "ring-red-400");
        setTimeout(() => el.classList.remove("ring-2", "ring-red-400"), 900);
        if (typeof el.focus === "function") el.focus();
    };

    const next = async () => {
        setSubmitError(null);
        if (isThankYou) return;

        // niemals submitten – nur validieren & step wechseln
        if (activeStep.key !== "review") {
            const ok = await methods.trigger(activeStep.fields, { shouldFocus: true });
            if (!ok) {
                const firstErrorField = (activeStep.fields || []).find(
                    (f) => !!getErrorByPath(methods.formState.errors, f)
                );
                if (firstErrorField) scrollToField(firstErrorField);
                return;
            }
        }

        setDirection(1);
        setActiveIndex((i) => Math.min(i + 1, steps.length - 1));
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    const back = () => {
        setSubmitError(null);
        if (isThankYou) return;

        setDirection(-1);
        setActiveIndex((i) => Math.max(i - 1, 0));
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    const goToThankYou = (payload) => {
        const idx = steps.findIndex((s) => s.key === "thankyou");
        if (idx === -1) return;
        setSubmitResult(payload);
        setDirection(1);
        setActiveIndex(idx);
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    const onSubmit = useCallback(async (data) => {
        setSubmitError(null);

        setIsSubmitting(true);
        try {
            const res = await fetch("/api/anamnese", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
            });

            const payload = await res.json().catch(() => null);

            if (!res.ok || !payload?.ok) {
                setSubmitError(
                    "Beim Senden ist ein Fehler aufgetreten. Bitte erneut versuchen oder die Praxis kontaktieren."
                );
                return;
            }

            goToThankYou(payload);
        } catch (e) {
            setSubmitError(
                "Keine Verbindung zum Server. Bitte prüfen Sie Ihre Internetverbindung und versuchen Sie es erneut."
            );
        } finally {
            setIsSubmitting(false);
        }
    }, []);

    // Enter-Key: niemals Form submitten (außer du willst später mal gezielt Enter-UX)
    const handleKeyDown = (e) => {
        if (e.key !== "Enter") return;
        const tag = e.target?.tagName?.toLowerCase();
        if (tag === "textarea") return;
        e.preventDefault();
    };

    return (
        <FormProvider {...methods}>
            <form
                onSubmit={(e) => e.preventDefault()} // <<< FORM NIE automatisch submitten
                onKeyDown={handleKeyDown} // <<< Enter blocken
                className="mx-auto w-full max-w-3xl px-4 py-10"
            >
                {/* Header */}
                <div className="mb-6">
                    <div className="flex items-center justify-between gap-4">
                        <h1 className="text-2xl font-semibold">Online-Anamnese</h1>
                        {!isThankYou && <div className="text-sm opacity-70">{progress}%</div>}
                    </div>

                    {!isThankYou && (
                        <>
                            <div
                                className="mt-3 h-2 w-full rounded-full"
                                style={{ backgroundColor: BRAND.primarySoft }}
                            >
                                <div
                                    className="h-2 rounded-full"
                                    style={{ width: `${progress}%`, backgroundColor: BRAND.primary }}
                                />
                            </div>

                            <div className="mt-3 text-sm opacity-80">
                                Schritt {activeIndex + 1} von {steps.length}:{" "}
                                <span className="font-medium">{activeStep.title}</span>
                            </div>
                        </>
                    )}
                </div>

                {/* Step Error Summary */}
                {stepErrors.length > 0 && activeStep.key !== "review" && !isThankYou && (
                    <div
                        className="mb-4 rounded-2xl border px-4 py-3 text-sm"
                        style={{ borderColor: "rgba(220,38,38,0.25)", backgroundColor: BRAND.errorSoft }}
                    >
                        <div className="font-medium text-red-700">
                            Bitte {stepErrors.length} Pflichtfeld{stepErrors.length === 1 ? "" : "er"} prüfen.
                        </div>
                        <ul className="mt-2 list-disc pl-5 text-red-700/90">
                            {stepErrors.slice(0, 5).map((e) => (
                                <li key={e.fieldPath}>{e.message}</li>
                            ))}
                        </ul>
                    </div>
                )}

                {submitError && (
                    <div className="mb-4 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
                        {submitError}
                    </div>
                )}

                {/* Animated Step Container */}
                <div className="rounded-2xl border border-black/10 bg-white p-5 shadow-sm">
                    <AnimatePresence mode="wait" initial={false} custom={direction}>
                        <motion.div
                            key={activeStep.key}
                            custom={direction}
                            variants={variants}
                            initial="enter"
                            animate="center"
                            exit="exit"
                        >
                            <StepRenderer stepKey={activeStep.key} submitResult={submitResult} />
                        </motion.div>
                    </AnimatePresence>
                </div>

                {/* Navigation */}
                {!isThankYou && (
                    <div className="mt-6 flex items-center justify-between gap-3">
                        <BasicButton type="button" onClick={back} disabled={activeIndex === 0 || isSubmitting}>
                            Zurück
                        </BasicButton>

                        {isReview ? (
                            <PrimaryButton
                                type="button" // <<< WICHTIG: niemals submit
                                disabled={isSubmitting}
                                onClick={methods.handleSubmit(onSubmit)} // <<< einzig legitimer Submit
                            >
                                {isSubmitting ? "Sende …" : "Verbindlich absenden"}
                            </PrimaryButton>
                        ) : (
                            <PrimaryButton type="button" onClick={next} disabled={isSubmitting}>
                                Weiter
                            </PrimaryButton>
                        )}
                    </div>
                )}

                {!isThankYou && (
                    <p className="mt-4 text-xs opacity-70">
                        Pflichtangaben werden pro Schritt geprüft. Optionale Angaben können übersprungen werden.
                    </p>
                )}
            </form>
        </FormProvider>
    );
}
