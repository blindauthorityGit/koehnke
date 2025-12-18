import Link from "next/link";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Logo from "@/assets/logo.svg";
import Burger from "@/assets/burger.svg";
import { FiCalendar, FiX } from "react-icons/fi";
import { PrimaryButton } from "@/components/buttons";
import { useAppointmentModal } from "@/components/appointments/appointmentModalProvider";

const dropdownVariants = {
    initial: { opacity: 0, y: 6, scale: 0.98, filter: "blur(6px)" },
    animate: {
        opacity: 1,
        y: 0,
        scale: 1,
        filter: "blur(0px)",
        transition: { duration: 0.22, ease: [0.16, 0.6, 0.25, 1] },
    },
    exit: {
        opacity: 0,
        y: 4,
        scale: 0.985,
        filter: "blur(4px)",
        transition: { duration: 0.18, ease: [0.3, 0, 0.3, 1] },
    },
};

const leistungenItems = [
    { label: "Zahnerhaltung", href: "/leistungen/zahnerhaltung" },
    { label: "Endodontie", href: "/leistungen/endodontie" },
    { label: "Zahnersatz", href: "/leistungen/zahnersatz" },
    { label: "Prophylaxe", href: "/leistungen/prophylaxe" },
    { label: "Implantologie", href: "/leistungen/implantologie" },
    { label: "Chirurgie", href: "/leistungen/chirurgie" },
    { label: "Zahnästhetik", href: "/leistungen/zahnaesthetik" },
    { label: "Kinderbehandlung", href: "/leistungen/kinderbehandlung" },
    { label: "Angstpatienten", href: "/leistungen/angstpatienten" },
    { label: "Parodontologie", href: "/leistungen/parodontologie" },
];

// ✅ NEU: Service Items laut deiner Liste
const serviceItems = [
    { label: "Termin buchen", href: "/termin" }, // ggf. /termin-buchen
    { label: "Infos für Neupatienten", href: "/service/neupatienten" }, // ggf. /neupatienten
    { label: "Downloads", href: "/service/downloads" }, // ggf. /service/downloads
    { label: "Online Anamnese", href: "/service/anamnese" }, // ggf. /service/online-anamnese
];

function Dropdown({ label, href, items, id, openMenu, setOpenMenu }) {
    const isOpen = openMenu === id;

    return (
        <div className="relative" onMouseEnter={() => setOpenMenu(id)} onMouseLeave={() => setOpenMenu(null)}>
            {/* Trigger: kompletter Hauptpunkt ist Link */}
            <Link
                href={href}
                className="flex items-center gap-1 tracking-wider text-sm text-delft hover:text-primary-600 transition-colors"
            >
                <span>{label}</span>
                <motion.span
                    className="text-[10px]"
                    animate={{ rotate: isOpen ? 180 : 0 }}
                    transition={{ duration: 0.18, ease: [0.45, 0, 0.2, 1] }}
                >
                    ▼
                </motion.span>
            </Link>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        variants={dropdownVariants}
                        initial="initial"
                        animate="animate"
                        exit="exit"
                        className="absolute left-0 top-full mt-3 min-w-[260px] rounded-2xl bg-white/95 shadow-lg ring-1 ring-primary-100/60 backdrop-blur-sm overflow-hidden"
                    >
                        <div className="flex flex-col py-2">
                            {items.map((item) => (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    className="px-4 py-2.5 text-sm tracking-wider text-delft/90 hover:bg-primary-50/90 hover:text-delft-900 transition-colors"
                                >
                                    {item.label}
                                </Link>
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

export default function Header() {
    const [openMenu, setOpenMenu] = useState(null); // Desktop-Dropdowns
    const [isMobileOpen, setIsMobileOpen] = useState(false);
    const { openAppointment } = useAppointmentModal();

    // "leistungen" | "service" | null – nur ein Submenü gleichzeitig offen
    const [openMobileSection, setOpenMobileSection] = useState(null);
    const isLeistungenOpen = openMobileSection === "leistungen";
    const isServiceOpen = openMobileSection === "service";

    const closeMobile = () => {
        setIsMobileOpen(false);
        setOpenMobileSection(null);
    };

    return (
        <header className="bg-primary-50/80 backdrop-blur sticky font-body top-0 z-40 relative">
            <div className="container mx-auto flex items-center justify-between py-4 lg:py-5">
                {/* Logo */}
                <div className="flex items-center gap-3">
                    <Link href="/" className="flex flex-col leading-tight" onClick={closeMobile}>
                        <img
                            src={Logo.src}
                            alt="Zentrum für Zahnmedizin"
                            className="h-12 lg:h-14 xl:h-16 2xl:h-20 w-auto"
                        />
                    </Link>
                </div>

                {/* DESKTOP NAVIGATION (ab lg) */}
                <nav className="hidden lg:flex items-center gap-12 text-sm text-delft">
                    <Link href="/praxis" className="tracking-wider hover:text-primary-600 transition-colors">
                        Praxis
                    </Link>

                    <Dropdown
                        label="Leistungen"
                        href="/leistungen"
                        id="leistungen"
                        items={leistungenItems}
                        openMenu={openMenu}
                        setOpenMenu={setOpenMenu}
                    />

                    <Dropdown
                        label="Service"
                        href="/service"
                        id="service"
                        items={serviceItems}
                        openMenu={openMenu}
                        setOpenMenu={setOpenMenu}
                    />

                    <Link href="/karriere" className="tracking-wider hover:text-primary-600 transition-colors">
                        Karriere
                    </Link>
                    <Link href="/kontakt" className="tracking-wider hover:text-primary-600 transition-colors">
                        Kontakt
                    </Link>

                    <PrimaryButton
                        variant="compact"
                        icon={<FiCalendar />}
                        className="hidden lg:inline-flex"
                        type="button"
                        onClick={openAppointment}
                    >
                        Termin vereinbaren
                    </PrimaryButton>
                </nav>

                {/* Burger: Mobile / Tablet */}
                <motion.button
                    type="button"
                    whileTap={{ scale: 0.94 }}
                    className="lg:hidden inline-flex items-center justify-center rounded-full"
                    onClick={() => setIsMobileOpen((prev) => !prev)}
                    aria-label="Menü öffnen"
                >
                    <AnimatePresence mode="wait" initial={false}>
                        {isMobileOpen ? (
                            <motion.span
                                key="close"
                                initial={{ opacity: 0, rotate: -90, scale: 0.8 }}
                                animate={{ opacity: 1, rotate: 0, scale: 1 }}
                                exit={{ opacity: 0, rotate: 90, scale: 0.8 }}
                                transition={{ duration: 0.18 }}
                            >
                                <FiX className="h-7 w-7 text-delft" />
                            </motion.span>
                        ) : (
                            <motion.img
                                key="burger"
                                src={Burger.src}
                                alt=""
                                className="h-7 w-7"
                                initial={{ opacity: 0, rotate: -90, scale: 0.8 }}
                                animate={{ opacity: 1, rotate: 0, scale: 1 }}
                                exit={{ opacity: 0, rotate: 90, scale: 0.8 }}
                                transition={{ duration: 0.18 }}
                            />
                        )}
                    </AnimatePresence>
                </motion.button>
            </div>

            {/* Mobile Menu Panel */}
            <AnimatePresence>
                {isMobileOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -8 }}
                        transition={{ duration: 0.22, ease: [0.16, 0.6, 0.25, 1] }}
                        className="
                            lg:hidden absolute inset-x-0 top-full
                            bg-primary-50/95 backdrop-blur-md shadow-lg border-t border-primary-100
                            max-h-[calc(100vh-4.5rem)] overflow-y-auto z-30
                        "
                    >
                        <div className="container mx-auto px-4 py-4 space-y-4 text-sm text-delft">
                            <div className="flex flex-col gap-2">
                                <Link
                                    href="/praxis"
                                    onClick={closeMobile}
                                    className="py-2 tracking-wider hover:text-primary-600 transition-colors"
                                >
                                    Praxis
                                </Link>

                                {/* LEISTUNGEN Akkordeon */}
                                <div className="pt-1">
                                    <div className="flex w-full items-center justify-between py-2">
                                        <Link
                                            href="/leistungen"
                                            onClick={closeMobile}
                                            className="tracking-wider hover:text-primary-600 transition-colors"
                                        >
                                            Leistungen
                                        </Link>

                                        <button
                                            type="button"
                                            onClick={() =>
                                                setOpenMobileSection((prev) =>
                                                    prev === "leistungen" ? null : "leistungen"
                                                )
                                            }
                                            className="ml-4 inline-flex items-center justify-center"
                                            aria-label="Leistungen Untermenü öffnen"
                                        >
                                            <motion.span
                                                className="text-xs"
                                                animate={{ rotate: isLeistungenOpen ? 180 : 0 }}
                                                transition={{ duration: 0.18, ease: [0.45, 0, 0.2, 1] }}
                                            >
                                                ▼
                                            </motion.span>
                                        </button>
                                    </div>

                                    <AnimatePresence>
                                        {isLeistungenOpen && (
                                            <motion.div
                                                initial={{ opacity: 0, y: -4, height: 0 }}
                                                animate={{ opacity: 1, y: 0, height: "auto" }}
                                                exit={{ opacity: 0, y: -4, height: 0 }}
                                                transition={{ duration: 0.2, ease: [0.16, 0.6, 0.25, 1] }}
                                                className="pl-1"
                                            >
                                                <div className="flex flex-col">
                                                    {leistungenItems.map((item) => (
                                                        <Link
                                                            key={item.href}
                                                            href={item.href}
                                                            onClick={closeMobile}
                                                            className="py-1.5 text-[0.9rem] tracking-wide text-delft/90 hover:text-primary-600 transition-colors"
                                                        >
                                                            {item.label}
                                                        </Link>
                                                    ))}
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>

                                {/* SERVICE Akkordeon */}
                                <div className="pt-1">
                                    <div className="flex w-full items-center justify-between py-2">
                                        <Link
                                            href="/service"
                                            onClick={closeMobile}
                                            className="tracking-wider hover:text-primary-600 transition-colors"
                                        >
                                            Service
                                        </Link>

                                        <button
                                            type="button"
                                            onClick={() =>
                                                setOpenMobileSection((prev) => (prev === "service" ? null : "service"))
                                            }
                                            className="ml-4 inline-flex items-center justify-center"
                                            aria-label="Service Untermenü öffnen"
                                        >
                                            <motion.span
                                                className="text-xs"
                                                animate={{ rotate: isServiceOpen ? 180 : 0 }}
                                                transition={{ duration: 0.18, ease: [0.45, 0, 0.2, 1] }}
                                            >
                                                ▼
                                            </motion.span>
                                        </button>
                                    </div>

                                    <AnimatePresence>
                                        {isServiceOpen && (
                                            <motion.div
                                                initial={{ opacity: 0, y: -4, height: 0 }}
                                                animate={{ opacity: 1, y: 0, height: "auto" }}
                                                exit={{ opacity: 0, y: -4, height: 0 }}
                                                transition={{ duration: 0.2, ease: [0.16, 0.6, 0.25, 1] }}
                                                className="pl-1"
                                            >
                                                <div className="flex flex-col">
                                                    {serviceItems.map((item) => (
                                                        <Link
                                                            key={item.href}
                                                            href={item.href}
                                                            onClick={closeMobile}
                                                            className="py-1.5 text-[0.9rem] tracking-wide text-delft/90 hover:text-primary-600 transition-colors"
                                                        >
                                                            {item.label}
                                                        </Link>
                                                    ))}
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>

                                <Link
                                    href="/karriere"
                                    onClick={closeMobile}
                                    className="py-2 tracking-wider hover:text-primary-600 transition-colors"
                                >
                                    Karriere
                                </Link>

                                <Link
                                    href="/kontakt"
                                    onClick={closeMobile}
                                    className="py-2 tracking-wider hover:text-primary-600 transition-colors"
                                >
                                    Kontakt
                                </Link>
                            </div>

                            <div className="pt-2 pb-4">
                                <PrimaryButton
                                    icon={<FiCalendar />}
                                    className="w-full justify-center"
                                    type="button"
                                    onClick={() => {
                                        closeMobile();
                                        // kleiner Tick, damit das Menü zuerst sauber zugeht
                                        setTimeout(() => openAppointment(), 0);
                                    }}
                                >
                                    Termin vereinbaren
                                </PrimaryButton>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </header>
    );
}
