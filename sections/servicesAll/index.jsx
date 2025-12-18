// sections/servicesOverview/index.jsx

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";

import { urlFor } from "@/function/urlFor";
import { H2 } from "@/typography/headlines";
import { BasicButton } from "@/components/buttons";

const textVariants = {
    initial: { opacity: 0, y: 8, filter: "blur(4px)" },
    animate: {
        opacity: 1,
        y: 0,
        filter: "blur(0px)",
        transition: { duration: 0.25, ease: [0.16, 0.6, 0.25, 1] },
    },
    exit: {
        opacity: 0,
        y: -8,
        filter: "blur(4px)",
        transition: { duration: 0.18, ease: [0.4, 0.0, 0.2, 1] },
    },
};

const imageVariants = {
    initial: { opacity: 0, scale: 0.98 },
    animate: {
        opacity: 1,
        scale: 1,
        transition: { duration: 0.3, ease: [0.16, 0.6, 0.25, 1] },
    },
    exit: {
        opacity: 0,
        scale: 0.98,
        transition: { duration: 0.18, ease: [0.4, 0.0, 0.2, 1] },
    },
};

export default function ServicesOverview({ services = [] }) {
    const headerOffset = 160; // Offset für Sticky-Dropdown / Header

    const getSectionId = (service, index) => service.slug || service._id || `service-${index}`;

    // Default-ID für Mobile-Dropdown
    const firstId = services[0] ? getSectionId(services[0], 0) : "first";

    // Hooks MÜSSEN vor jedem return kommen
    const [activeIndex, setActiveIndex] = useState(0); // Desktop
    const [selectedId, setSelectedId] = useState(firstId); // Mobile Dropdown

    // Dropdown beim Scrollen automatisch aktualisieren (nur Mobile)
    useEffect(() => {
        if (typeof window === "undefined") return;

        const onScroll = () => {
            // Nur auf Mobile reagieren
            if (window.innerWidth >= 1024) return; // lg-Breakpoint

            let closestId = selectedId;
            let smallestDiff = Infinity;

            services.forEach((service, index) => {
                const id = getSectionId(service, index);
                const el = document.getElementById(id);
                if (!el) return;

                const rect = el.getBoundingClientRect();
                const diff = Math.abs(rect.top - headerOffset);

                if (rect.top <= headerOffset + 80 && diff < smallestDiff) {
                    smallestDiff = diff;
                    closestId = id;
                }
            });

            if (closestId && closestId !== selectedId) {
                setSelectedId(closestId);
            }
        };

        window.addEventListener("scroll", onScroll, { passive: true });
        onScroll(); // initial

        return () => {
            window.removeEventListener("scroll", onScroll);
        };
    }, [services, selectedId, headerOffset]);

    // AB HIER darfst du frühzeitig returnen – Hooks sind alle oben
    if (!services.length) return null;

    const safeIndex = Math.min(activeIndex, services.length - 1);
    const activeService = services[safeIndex];

    const serviceImage = activeService?.heroImage || activeService?.image || null;
    const activeImageUrl = serviceImage ? urlFor(serviceImage.asset || serviceImage).url() : null;

    const handleMobileSelect = (event) => {
        const value = event.target.value;
        setSelectedId(value);

        if (typeof window !== "undefined") {
            const el = document.getElementById(value);
            if (el) {
                const rect = el.getBoundingClientRect();
                const scrollTop = window.scrollY + rect.top - headerOffset;

                window.scrollTo({ top: scrollTop, behavior: "smooth" });
            }
        }
    };

    return (
        <section className="py-16 md:py-20 lg:py-28 bg-primary-50">
            <div className="mx-auto container px-4 sm:px-6 lg:px-8">
                {/* ----------------------------- */}
                {/* MOBILE-VARIANTE               */}
                {/* ----------------------------- */}
                <div className="lg:hidden">
                    {/* Sticky Dropdown oben */}
                    <div className="sticky top-16 z-20 -mx-4 mb-8 bg-primary-50/95 px-4 py-3 shadow-sm backdrop-blur">
                        <label
                            htmlFor="services-select"
                            className="mb-2 block text-xs font-semibold uppercase tracking-[0.16em] text-primary-500"
                        >
                            Leistungen
                        </label>
                        <select
                            id="services-select"
                            value={selectedId}
                            onChange={handleMobileSelect}
                            className="
                                w-full rounded-full border border-primary-200 bg-white px-4 py-2.5
                                text-sm text-delft shadow-sm outline-none
                                focus:border-primary-500 focus:ring-1 focus:ring-primary-500
                           
                                "
                        >
                            {services.map((service, index) => {
                                const sectionId = getSectionId(service, index);
                                return (
                                    <option key={sectionId} value={sectionId}>
                                        {service.title}
                                    </option>
                                );
                            })}
                        </select>
                    </div>

                    {/* Alle Leistungen untereinander */}
                    <div className="space-y-16">
                        {services.map((service, index) => {
                            const sectionId = getSectionId(service, index);
                            const img = service.heroImage || service.image;
                            const imgUrl = img ? urlFor(img.asset || img).url() : null;

                            return (
                                <section key={sectionId} id={sectionId} className="scroll-mt-24">
                                    <H2 className="mb-4 text-2xl text-primary-900">{service.title}</H2>

                                    {service.teaser && (
                                        <p className="mb-5 text-base tracking-wider leading-relaxed text-delft">
                                            {service.teaser}
                                        </p>
                                    )}

                                    {service.slug && (
                                        <Link href={`/leistungen/${service.slug}`} passHref>
                                            <BasicButton as="a">mehr erfahren</BasicButton>
                                        </Link>
                                    )}

                                    {imgUrl && (
                                        <div className="mt-8">
                                            <Image
                                                src={imgUrl}
                                                alt={service.title || ""}
                                                width={520}
                                                height={360}
                                                className="h-auto w-full max-w-md rounded-3xl object-cover"
                                            />
                                        </div>
                                    )}
                                </section>
                            );
                        })}
                    </div>
                </div>

                {/* ----------------------------- */}
                {/* DESKTOP-LAYOUT (unchanged)    */}
                {/* ----------------------------- */}
                <div
                    className="
                        hidden
                        lg:grid lg:gap-14
                        lg:grid-cols-[220px_minmax(0,1.25fr)_minmax(0,1.1fr)]
                        items-start
                    "
                >
                    {/* LEFT COLUMN – Desktop Nav */}
                    <aside className="border-r border-primary-200 pr-10">
                        <ul className="space-y-4">
                            {services.map((service, index) => {
                                const isActive = index === safeIndex;

                                return (
                                    <li key={service._id || service.slug || index}>
                                        <button
                                            type="button"
                                            onClick={() => setActiveIndex(index)}
                                            className={`
                                                group flex w-full cursor-pointer items-center gap-3 text-left text-base font-medium font-body tracking-wide
                                                transition
                                                ${isActive ? "text-primary-500" : "text-delft hover:text-primary-900"}
                                            `}
                                        >
                                            <span
                                                className={`
                                                    h-px w-8 transition-all
                                                    ${
                                                        isActive
                                                            ? "bg-primary-700"
                                                            : "bg-primary-200 group-hover:bg-primary-400"
                                                    }
                                                `}
                                            />
                                            <span
                                                className={`
                                                    transition
                                                    ${
                                                        isActive
                                                            ? "text-primary-500"
                                                            : "text-delft group-hover:text-primary-900"
                                                    }
                                                `}
                                            >
                                                {service.title}
                                            </span>
                                        </button>
                                    </li>
                                );
                            })}
                        </ul>
                    </aside>

                    {/* CENTER COLUMN – Text Content */}
                    <div className="relative h-full">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={activeService._id || activeService.slug || safeIndex}
                                variants={textVariants}
                                initial="initial"
                                animate="animate"
                                exit="exit"
                                className="space-y-6 md:space-y-8 h-full"
                            >
                                <div className="space-y-4">
                                    <H2 className="text-3xl md:text-4xl text-primary-900">{activeService.title}</H2>

                                    {activeService.teaser && (
                                        <p className="max-w-xl text-base tracking-wider leading-relaxed text-delft">
                                            {activeService.teaser}
                                        </p>
                                    )}
                                </div>

                                {activeService.slug && (
                                    <Link href={`/leistungen/${activeService.slug}`} passHref>
                                        <BasicButton as="a">mehr erfahren</BasicButton>
                                    </Link>
                                )}
                            </motion.div>
                        </AnimatePresence>
                    </div>

                    {/* RIGHT COLUMN – Image */}
                    <div className="relative mt-6 lg:mt-0 flex justify-center lg:justify-end">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={activeImageUrl || "no-image"}
                                variants={imageVariants}
                                initial="initial"
                                animate="animate"
                                exit="exit"
                                className="inline-block"
                            >
                                {activeImageUrl && (
                                    <Image
                                        src={activeImageUrl}
                                        alt={activeService.title || ""}
                                        width={520}
                                        height={360}
                                        priority={safeIndex === 0}
                                        className="h-auto w-full max-w-md object-cover"
                                    />
                                )}
                            </motion.div>
                        </AnimatePresence>
                    </div>
                </div>
            </div>
        </section>
    );
}
