// components/layout/Footer.jsx
import Image from "next/image";
import Link from "next/link";
import { BsTelephone, BsEnvelope } from "react-icons/bs";
import PrimaryButton from "@/components/buttons/primaryButton";
import PraxisLogo from "@/assets/logo.svg";

export default function Footer() {
    return (
        <footer className="bg-primary-50 pt-0">
            {/* Welle direkt am oberen Rand, ohne Abstand */}
            <svg
                viewBox="0 0 1440 320"
                xmlns="http://www.w3.org/2000/svg"
                className="h-24 w-full text-white"
                preserveAspectRatio="none"
            >
                <path
                    fill="currentColor"
                    d="
                        M0,96
                        C 240,160 480,192 720,176
                        C 960,160 1200,112 1440,128
                        L1440,320
                        L0,320
                        Z
                    "
                />
            </svg>

            {/* Weißer Footer-Body direkt unter der Welle */}
            <div className="bg-white -mt-px">
                <div className="mx-auto container px-4 py-16">
                    <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">
                        {/* Logo + Adresse */}
                        <div className="space-y-5">
                            <Link href="/" aria-label="Zur Startseite">
                                <div className="relative h-16 w-56">
                                    <Image
                                        src={PraxisLogo}
                                        alt="Zentrum für Zahnmedizin – Dr. Köhnke & Kollegen"
                                        fill
                                        className="object-contain"
                                    />
                                </div>
                            </Link>

                            <div className="space-y-1 text-sm text-delft">
                                <p className="font-semibold text-primary-900">Zentrum für Zahnmedizin</p>
                                <p>Dr. Köhnke &amp; Kollegen</p>
                                <p>Schulstraße 43</p>
                                <p>65795 Hattersheim am Main</p>
                            </div>

                            <div className="mt-4 space-y-1 text-sm text-delft">
                                <p className="flex items-center gap-2">
                                    <BsTelephone className="h-4 w-4" />
                                    <a
                                        href="tel:+496190989500"
                                        className="hover:underline underline-offset-4"
                                        aria-label="Telefonnummer anrufen"
                                    >
                                        <span className="font-semibold">Telefon:</span> 06190 / 989500
                                    </a>
                                </p>

                                <p className="flex items-center gap-2">
                                    <BsEnvelope className="h-4 w-4" />
                                    <a
                                        href="mailto:kollegen@zahnarzt-koehnke.de"
                                        className="hover:underline underline-offset-4"
                                        aria-label="E-Mail senden"
                                    >
                                        <span className="font-semibold">E-Mail:</span> kollegen@zahnarzt-koehnke.de
                                    </a>
                                </p>
                            </div>
                        </div>

                        {/* Öffnungszeiten + PrimaryButton */}
                        <div className="flex flex-col justify-between gap-6">
                            <div>
                                <p className="mb-2 text-base font-semibold text-primary-900">Öffnungszeiten</p>
                                <div className="grid grid-cols-[auto_auto] gap-x-6 gap-y-1 text-sm text-delft">
                                    <span>Mo, Di, Do</span>
                                    <span>08:00 - 13:00</span>
                                    <span></span>
                                    <span>14:30 - 18:00</span>
                                    <span>Mi, Fr</span>
                                    <span>08:00 - 14:00</span>
                                    <span>Sa - So</span>
                                    <span>Geschlossen</span>
                                </div>
                            </div>
                        </div>

                        {/* Leistungen */}
                        <div className="text-sm text-delft">
                            <p className="mb-3 text-base font-semibold text-primary-900">Leistungen</p>
                            <ul className="space-y-1">
                                {/* Passe Slugs an eure echten Service-URLs an */}
                                <li>
                                    <Link
                                        className="hover:underline underline-offset-4"
                                        href="/leistungen/zahnerhaltung"
                                    >
                                        Zahnerhaltung
                                    </Link>
                                </li>
                                <li>
                                    <Link className="hover:underline underline-offset-4" href="/leistungen/zahnersatz">
                                        Zahnersatz
                                    </Link>
                                </li>
                                <li>
                                    <Link className="hover:underline underline-offset-4" href="/leistungen/prophylaxe">
                                        Prophylaxe
                                    </Link>
                                </li>
                                <li>
                                    <Link
                                        className="hover:underline underline-offset-4"
                                        href="/leistungen/implantologie"
                                    >
                                        Implantologie
                                    </Link>
                                </li>
                                <li>
                                    <Link className="hover:underline underline-offset-4" href="/leistungen/chirurgie">
                                        Chirurgie
                                    </Link>
                                </li>
                                <li>
                                    <Link
                                        className="hover:underline underline-offset-4"
                                        href="/leistungen/zahnaesthetik"
                                    >
                                        Zahnästhetik
                                    </Link>
                                </li>
                                <li>
                                    <Link
                                        className="hover:underline underline-offset-4"
                                        href="/leistungen/kinderbehandlung"
                                    >
                                        Kinderbehandlung
                                    </Link>
                                </li>
                                <li>
                                    <Link
                                        className="hover:underline underline-offset-4"
                                        href="/leistungen/angstpatienten"
                                    >
                                        Angstpatienten
                                    </Link>
                                </li>
                                <li>
                                    <Link
                                        className="hover:underline underline-offset-4"
                                        href="/leistungen/parodontologie"
                                    >
                                        Parodontologie
                                    </Link>
                                </li>
                                <li>
                                    <Link className="hover:underline underline-offset-4" href="/leistungen/endodontie">
                                        Endodontie
                                    </Link>
                                </li>
                            </ul>
                        </div>

                        {/* Service & Kontakt */}
                        <div className="text-sm text-delft">
                            <p className="mb-3 text-base font-semibold text-primary-900">Service &amp; Kontakt</p>
                            <ul className="space-y-1 mb-4">
                                <li>
                                    <Link className="hover:underline underline-offset-4" href="/kontakt">
                                        Kontakt
                                    </Link>
                                </li>
                                <li>
                                    <Link className="hover:underline underline-offset-4" href="/karriere">
                                        Karriere
                                    </Link>
                                </li>
                            </ul>

                            <ul className="space-y-1">
                                <li>
                                    <Link className="hover:underline underline-offset-4" href="/impressum">
                                        Impressum
                                    </Link>
                                </li>
                                <li>
                                    <Link className="hover:underline underline-offset-4" href="/datenschutz">
                                        Datenschutz
                                    </Link>
                                </li>
                                <li>
                                    <Link className="hover:underline underline-offset-4" href="/barrierefreiheit">
                                        Barrierefreiheitserklärung
                                    </Link>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>

                {/* Linie + Copyright */}
                <div className="border-t border-primary-100">
                    <div className="mx-auto max-w-6xl px-4 py-4 text-xs text-delft/70 flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                        <span>© {new Date().getFullYear()} Zentrum für Zahnmedizin – Dr. Köhnke &amp; Kollegen</span>
                        <a
                            href="https://www.sabocon.com"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="hover:underline underline-offset-4"
                        >
                            Webdesign &amp; Entwicklung: Sabocon GmbH
                        </a>
                    </div>
                </div>
            </div>
        </footer>
    );
}
