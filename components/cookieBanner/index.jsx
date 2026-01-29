import { useSyncExternalStore } from "react";

const STORAGE_KEY = "cookie_consent_v1";
// Werte: "accepted" | "rejected" | "necessary"

function readConsent() {
    try {
        return window.localStorage.getItem(STORAGE_KEY);
    } catch {
        return null;
    }
}

function subscribe(callback) {
    // Re-render bei localStorage Änderungen (auch tab-übergreifend)
    const onStorage = (e) => {
        if (e.key === STORAGE_KEY) callback();
    };

    // Re-render bei Änderungen im selben Tab (wir dispatchen das gleich)
    const onCustom = () => callback();

    window.addEventListener("storage", onStorage);
    window.addEventListener("cookie-consent-changed", onCustom);

    return () => {
        window.removeEventListener("storage", onStorage);
        window.removeEventListener("cookie-consent-changed", onCustom);
    };
}

function getSnapshot() {
    // Client snapshot
    return readConsent(); // string | null
}

function getServerSnapshot() {
    // SSR: wir rendern erstmal NICHTS, damit es keine Flicker/Hydration-Mismatches gibt
    return "__SSR__";
}

function storeConsent(value) {
    try {
        window.localStorage.setItem(STORAGE_KEY, value);
        window.dispatchEvent(new Event("cookie-consent-changed"));
    } catch {}
}

export default function CookieBanner({ privacyHref = "/datenschutz", imprintHref = "/impressum", onChange }) {
    const consent = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

    // SSR oder "noch nicht geladen": nix rendern
    if (consent === "__SSR__") return null;

    // bereits entschieden -> nix rendern
    if (consent === "accepted" || consent === "rejected" || consent === "necessary") {
        return null;
    }

    function setAndPersist(value) {
        storeConsent(value);
        onChange?.(value);
    }

    return (
        <div className="fixed inset-x-0 bottom-0 z-[9999] px-4 pb-4 sm:px-6">
            <div className="mx-auto max-w-4xl rounded-3xl bg-white shadow-[0_24px_80px_rgba(15,23,42,0.18)] ring-1 ring-black/5">
                <div className="p-5 sm:p-6">
                    <div className="space-y-5">
                        {/* TEXT */}
                        <div className="space-y-2">
                            <p className="text-sm font-semibold text-slate-900">Cookies & Datenschutz</p>
                            <p className="text-sm leading-relaxed text-slate-700">
                                Wir verwenden Cookies, um grundlegende Funktionen bereitzustellen und – mit Ihrer
                                Einwilligung – Statistik/Marketing zu nutzen. Sie können Ihre Auswahl jederzeit ändern.
                            </p>
                            <p className="text-xs text-slate-600">
                                Mehr Infos:{" "}
                                <a className="underline hover:no-underline" href={privacyHref}>
                                    Datenschutz
                                </a>{" "}
                                ·{" "}
                                <a className="underline hover:no-underline" href={imprintHref}>
                                    Impressum
                                </a>
                            </p>
                        </div>

                        {/* BUTTONS – volle Breite */}
                        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                            <button
                                onClick={() => setAndPersist("necessary")}
                                className="h-12 w-full rounded-2xl px-6 text-sm font-medium
                   ring-1 ring-slate-200 hover:bg-slate-50"
                            >
                                Nur notwendige Cookies
                            </button>

                            <button
                                onClick={() => setAndPersist("rejected")}
                                className="h-12 w-full rounded-2xl px-6 text-sm font-medium
                   ring-1 ring-slate-200 hover:bg-slate-50"
                            >
                                Ablehnen
                            </button>

                            <button
                                onClick={() => setAndPersist("accepted")}
                                className="h-12 w-full rounded-2xl px-6 text-sm font-semibold
                   bg-slate-900 text-white hover:bg-slate-800"
                            >
                                Alle akzeptieren
                            </button>
                        </div>

                        <p className="text-[11px] text-slate-500">Auswahl wird lokal gespeichert.</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
