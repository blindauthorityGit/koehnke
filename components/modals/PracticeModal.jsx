import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { PortableText } from "@portabletext/react";
import { H2 } from "@/typography/headlines";

import { sanityClient } from "@/client"; // <- bei dir vorhanden

function withinSchedule(schedule) {
    if (!schedule?.start && !schedule?.end) return true;
    const now = Date.now();
    const start = schedule?.start ? new Date(schedule.start).getTime() : -Infinity;
    const end = schedule?.end ? new Date(schedule.end).getTime() : Infinity;
    return now >= start && now <= end;
}

/**
 * Erwartetes Link-Object (typisch bei euch):
 * {
 *   linkType: "internal"|"external",
 *   internalLink: { _type:"reference", _ref:"..." },
 *   externalUrl: "https://...",
 *   openInNewTab: boolean
 * }
 *
 * Wir lösen intern über Referenz -> slug auf (client fetch).
 */
async function resolveLinkToHref(linkObj) {
    if (!linkObj) return { href: null, isExternal: false, target: undefined };

    const linkType = linkObj?.linkType || linkObj?.type; // fallback
    const openInNewTab = !!(linkObj?.openInNewTab || linkObj?.blank);

    // External
    const externalUrl = linkObj?.externalUrl || linkObj?.url || linkObj?.href;
    if ((linkType === "external" || !!externalUrl) && externalUrl) {
        return {
            href: externalUrl,
            isExternal: true,
            target: openInNewTab ? "_blank" : undefined,
        };
    }

    // Internal reference
    const ref = linkObj?.internalLink?._ref || linkObj?.reference?._ref || linkObj?._ref;
    if (ref) {
        // Wir versuchen generisch: slug.current und optional eine direkte "href" am Dokument
        const q = `*[_id == $id][0]{ "slug": slug.current, "path": path, _type }`;
        const doc = await sanityClient.fetch(q, { id: ref });

        // Priorität: path > slug
        const slug = doc?.path || doc?.slug;

        if (slug) {
            const normalized = String(slug).startsWith("/") ? String(slug) : `/${slug}`;
            return {
                href: normalized,
                isExternal: false,
                target: openInNewTab ? "_blank" : undefined,
            };
        }
    }

    return { href: null, isExternal: false, target: undefined };
}

export default function PracticeModal({ data }) {
    const [open, setOpen] = useState(false);
    const [ctaHref, setCtaHref] = useState(null);
    const [ctaTarget, setCtaTarget] = useState(undefined);
    const [ctaExternal, setCtaExternal] = useState(false);

    const storageKey = "koehnke_practiceModal_seen";

    const contentKey = useMemo(() => {
        if (!data) return "";
        const v = data?.version && String(data.version).trim();
        return v ? v : data._updatedAt;
    }, [data]);

    // Open logic
    useEffect(() => {
        if (!data?.enabled) return;
        if (!withinSchedule(data.schedule)) return;

        try {
            const seen = localStorage.getItem(storageKey);

            if (!seen) {
                setOpen(true);
                return;
            }

            if (data.reopenOnChange === false) {
                setOpen(false);
                return;
            }

            if (seen !== contentKey) {
                setOpen(true);
                return;
            }

            setOpen(false);
        } catch {
            setOpen(true);
        }
    }, [data, contentKey]);

    // Resolve CTA link when data changes
    useEffect(() => {
        let cancelled = false;

        async function run() {
            const enabled = !!data?.cta?.enabled && !!data?.cta?.label && !!data?.cta?.link;
            if (!enabled) {
                if (!cancelled) {
                    setCtaHref(null);
                    setCtaTarget(undefined);
                    setCtaExternal(false);
                }
                return;
            }

            try {
                const resolved = await resolveLinkToHref(data.cta.link);
                if (!cancelled) {
                    setCtaHref(resolved.href);
                    setCtaTarget(resolved.target);
                    setCtaExternal(!!resolved.isExternal);
                }
            } catch {
                if (!cancelled) {
                    setCtaHref(null);
                    setCtaTarget(undefined);
                    setCtaExternal(false);
                }
            }
        }

        run();
        return () => {
            cancelled = true;
        };
    }, [data?.cta?.enabled, data?.cta?.label, data?.cta?.link]);

    // ESC + scroll lock
    useEffect(() => {
        if (!open) return;

        const onKeyDown = (e) => {
            if (e.key === "Escape") close();
        };

        document.addEventListener("keydown", onKeyDown);
        document.documentElement.style.overflow = "hidden";

        return () => {
            document.removeEventListener("keydown", onKeyDown);
            document.documentElement.style.overflow = "";
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [open]);

    function close() {
        setOpen(false);
        try {
            localStorage.setItem(storageKey, contentKey || "seen");
        } catch {}
    }

    if (!data?.enabled) return null;

    const imgUrl = data?.image?.asset?.url;
    const imgAlt = data?.image?.alt || data?.headline || "Aktuelles aus der Praxis";

    const ctaEnabled = !!data?.cta?.enabled && !!data?.cta?.label && !!data?.cta?.href;
    const href = data?.cta?.href || null;
    const newTab = !!data?.cta?.newTab;
    const isExternal = href ? /^https?:\/\//i.test(href) : false;

    // Buttons: mehr "button-like"
    const btnBase =
        "inline-flex items-center justify-center rounded-2xl px-5 py-3 text-sm font-semibold transition select-none cursor-pointer";
    const btnPrimary = `${btnBase} bg-delft-900 text-white hover:bg-delft-800 active:scale-[0.99]`;
    const btnSoft = `${btnBase} bg-slate-50 text-delft-900 hover:bg-slate-100 active:scale-[0.99]`;
    return (
        <AnimatePresence>
            {open && (
                <motion.div
                    className="fixed inset-0 z-[999] flex items-end md:items-center justify-center"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    role="dialog"
                    aria-modal="true"
                >
                    {/* Backdrop */}
                    <motion.button
                        type="button"
                        aria-label="Modal schließen"
                        onClick={close}
                        className="absolute inset-0 bg-black/55 cursor-pointer"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                    />

                    {/* Panel */}
                    <motion.div
                        className="
              relative w-full md:max-w-xl
              rounded-t-3xl md:rounded-3xl
              bg-white
              shadow-[0_24px_80px_rgba(15,23,42,0.18)]
              overflow-hidden
            "
                        initial={{ y: 28, opacity: 0, scale: 0.985, filter: "blur(6px)" }}
                        animate={{ y: 0, opacity: 1, scale: 1, filter: "blur(0px)" }}
                        exit={{ y: 16, opacity: 0, scale: 0.99, filter: "blur(4px)" }}
                        transition={{ duration: 0.22, ease: [0.16, 0.6, 0.25, 1] }}
                    >
                        {imgUrl && (
                            <div className="relative h-44 md:h-56 w-full">
                                <Image
                                    src={imgUrl}
                                    alt={imgAlt}
                                    fill
                                    priority
                                    sizes="(max-width: 768px) 100vw, 768px"
                                    className="object-cover"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/35 via-black/10 to-transparent" />
                            </div>
                        )}

                        <div className="p-5 md:p-8 text-delft-900">
                            <div className="flex items-start justify-between gap-4">
                                <H2 className="text-[17px] md:text-xl font-semibold tracking-tight leading-snug">
                                    {data?.headline}
                                </H2>

                                {/* Close button (top right) */}
                                <button type="button" onClick={close} className={`${btnSoft} rounded-full px-4 py-2`}>
                                    Schließen
                                </button>
                            </div>

                            <div className="mt-3 text-[15px] leading-relaxed text-text">
                                {Array.isArray(data?.text) ? <PortableText value={data.text} /> : null}
                            </div>

                            <div className="mt-6 flex flex-col md:flex-row gap-3 md:items-center">
                                {/* CTA */}
                                {ctaEnabled &&
                                    href &&
                                    (isExternal ? (
                                        <a
                                            href={href}
                                            target={newTab ? "_blank" : undefined}
                                            rel={newTab ? "noreferrer" : undefined}
                                            onClick={close}
                                            className={btnPrimary}
                                        >
                                            {data.cta.label}
                                        </a>
                                    ) : (
                                        <Link href={href} onClick={close} className={btnPrimary}>
                                            {data.cta.label}
                                        </Link>
                                    ))}

                                {/* Okay */}
                                <button type="button" onClick={close} className={btnSoft}>
                                    Okay
                                </button>
                            </div>

                            <p className="mt-4 text-xs text-delft-500">
                                Hinweis: Dieses Fenster wird pro Browser einmal angezeigt und bei Änderungen (optional)
                                erneut.
                            </p>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
