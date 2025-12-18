"use client";

import { PrimaryButton, BasicButton } from "@/components/buttons";
import Link from "next/link";

export default function StepThankYou({ submitResult }) {
    const pdfUrl = submitResult?.pdfUrl;

    return (
        <div className="space-y-4">
            <h2 className="text-xl font-semibold">Vielen Dank.</h2>
            <p className="text-sm opacity-80">Ihre Online-Anamnese wurde erfolgreich übermittelt.</p>

            <div className="rounded-2xl border border-black/10 bg-white p-4">
                <div className="text-sm">
                    <div>
                        <span className="opacity-70">Vorgangsnummer:</span> <b>{submitResult?.id || "—"}</b>
                    </div>
                    <div className="mt-2 opacity-70 text-xs">Bitte speichern Sie das PDF für Ihre Unterlagen.</div>
                </div>

                <div className="mt-4 flex flex-col gap-2 sm:flex-row">
                    {pdfUrl ? (
                        <a href={pdfUrl} target="_blank" rel="noreferrer">
                            <PrimaryButton type="button">PDF herunterladen</PrimaryButton>
                        </a>
                    ) : (
                        <PrimaryButton type="button" disabled>
                            PDF wird vorbereitet …
                        </PrimaryButton>
                    )}

                    <Link href="/">
                        <BasicButton type="button">Zur Startseite</BasicButton>
                    </Link>
                </div>
            </div>
        </div>
    );
}
