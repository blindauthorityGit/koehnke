// pages/impressum.jsx
import Head from "next/head";
import Link from "next/link";

export default function Impressum() {
    const title = "Impressum – Zentrum für Zahnmedizin Dr. Köhnke & Kollegen";
    const description = "Impressum der Zentrum für Zahnmedizin, Dr. Köhnke & Kollegen MVZ-GmbH in Hattersheim am Main.";

    return (
        <>
            <Head>
                <title>{title}</title>
                <meta name="description" content={description} />
                <meta property="og:title" content={title} />
                <meta property="og:description" content={description} />
                <meta name="robots" content="index,follow" />
            </Head>

            <main className="bg-primary-50">
                {/* Hero */}
                <section className="border-b border-primary-100 bg-white">
                    <div className="mx-auto max-w-6xl px-4 py-12 md:px-6 md:py-16">
                        <p className="mb-3 inline-flex rounded-full bg-primary-50 px-4 py-2 text-xs font-medium text-delft/80">
                            Rechtliches
                        </p>
                        <h1 className="text-3xl font-semibold tracking-tight text-delft md:text-4xl">Impressum</h1>
                        <p className="mt-4 max-w-2xl text-base leading-relaxed text-delft/80">Angaben gemäß § 5 TMG</p>
                    </div>
                </section>

                {/* Content */}
                <section className="mx-auto max-w-6xl px-4 py-10 md:px-6 md:py-14">
                    <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
                        {/* Left: Main blocks */}
                        <div className="space-y-6">
                            <Card>
                                <h2 className="text-lg font-semibold text-delft">Anbieter</h2>
                                <div className="mt-4 space-y-1 text-sm leading-relaxed text-delft/85">
                                    <p className="font-semibold text-delft">
                                        Zentrum für Zahnmedizin, Dr. Köhnke &amp; Kollegen MVZ-GmbH
                                    </p>
                                    <p>Schulstraße 43</p>
                                    <p>65795 Hattersheim am Main</p>
                                </div>

                                <div className="mt-5 space-y-2 text-sm text-delft/85">
                                    <p>
                                        <span className="font-semibold text-delft">Telefon:</span>{" "}
                                        <a className="underline underline-offset-4" href="tel:+496190989500">
                                            06190-989500
                                        </a>
                                    </p>
                                    <p>
                                        <span className="font-semibold text-delft">E-Mail:</span>{" "}
                                        <a
                                            className="underline underline-offset-4"
                                            href="mailto:info@zahnarzt-koehnke.de"
                                        >
                                            info@zahnarzt-koehnke.de
                                        </a>
                                    </p>
                                    <p>
                                        <span className="font-semibold text-delft">Internet:</span>{" "}
                                        <a
                                            className="underline underline-offset-4"
                                            href="https://www.zahnarztpraxis-hattersheim.de"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                        >
                                            www.zahnarztpraxis-hattersheim.de
                                        </a>
                                    </p>
                                </div>
                            </Card>

                            <Card>
                                <h2 className="text-lg font-semibold text-delft">Inhaber und Verantwortlicher</h2>
                                <p className="mt-4 text-sm leading-relaxed text-delft/85">
                                    Dr. med. dent. Thomas Köhnke
                                </p>
                            </Card>

                            <Card>
                                <h2 className="text-lg font-semibold text-delft">Berufsrechtliche Angaben</h2>

                                <div className="mt-4 space-y-3 text-sm leading-relaxed text-delft/85">
                                    <p>
                                        <span className="font-semibold text-delft">Kammer:</span> Landeszahnärztekammer
                                        Hessen
                                    </p>
                                    <p>
                                        <span className="font-semibold text-delft">Gesetzl. Berufsbezeichnung:</span>{" "}
                                        Zahnarzt (Deutschland)
                                    </p>

                                    <div className="rounded-2xl border border-primary-100 bg-primary-50 p-4">
                                        <p className="font-semibold text-delft">Berufsrechtliche Regelungen</p>
                                        <ul className="mt-2 list-disc space-y-1 pl-5">
                                            <li>Gesetz über die Ausübung der Zahnheilkunde</li>
                                            <li>Gebührenordnung für Zahnärzte</li>
                                            <li>Berufsordnung für hessische Zahnärztinnen und Zahnärzte</li>
                                            <li>Hessisches Heilberufsgesetz</li>
                                        </ul>
                                        <p className="mt-3">
                                            Abrufbar unter:{" "}
                                            <a
                                                className="underline underline-offset-4"
                                                href="https://www.lzkh.de"
                                                target="_blank"
                                                rel="noopener noreferrer"
                                            >
                                                www.lzkh.de
                                            </a>
                                        </p>
                                    </div>
                                </div>
                            </Card>

                            <Card>
                                <h2 className="text-lg font-semibold text-delft">Online-Streitbeilegung</h2>
                                <p className="mt-4 text-sm leading-relaxed text-delft/85">
                                    Online-Streitbeilegung gemäß Art. 14 Abs. 1 ODR-VO: Die Europäische Kommission
                                    stellt eine Plattform zur Online-Streitbeilegung (OS) bereit, die Sie unter{" "}
                                    <a
                                        className="underline underline-offset-4"
                                        href="http://ec.europa.eu/consumers/odr/"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                    >
                                        http://ec.europa.eu/consumers/odr/
                                    </a>{" "}
                                    finden. Darüber hinaus nimmt unser Betrieb an einem
                                    Verbraucherstreitigkeitsverfahren nicht teil.
                                </p>
                            </Card>
                        </div>

                        {/* Right: Quick links / actions */}
                        <aside className="space-y-4">
                            <div className="rounded-3xl border border-primary-100 bg-white p-6 shadow-[0_18px_60px_rgba(15,23,42,0.06)]">
                                <p className="text-sm font-semibold text-delft">Schnellzugriff</p>

                                <div className="mt-4 space-y-2 text-sm text-delft/85">
                                    <Link className="block underline underline-offset-4" href="/kontakt">
                                        Kontakt
                                    </Link>
                                    <Link className="block underline underline-offset-4" href="/datenschutz">
                                        Datenschutz
                                    </Link>
                                    <Link className="block underline underline-offset-4" href="/barrierefreiheit">
                                        Barrierefreiheitserklärung
                                    </Link>
                                </div>

                                <div className="mt-6 grid gap-3">
                                    <a
                                        href="tel:+496190989500"
                                        className="inline-flex items-center justify-center rounded-xl bg-delft px-4 py-3 text-sm font-medium text-white transition hover:opacity-95"
                                    >
                                        Anrufen
                                    </a>
                                    <a
                                        href="mailto:info@zahnarzt-koehnke.de"
                                        className="inline-flex items-center justify-center rounded-xl border border-primary-200 bg-white px-4 py-3 text-sm font-medium text-delft transition hover:bg-primary-50"
                                    >
                                        E-Mail senden
                                    </a>
                                </div>
                            </div>

                            <p className="px-1 text-xs leading-relaxed text-delft/60">
                                Hinweis: Diese Seite ersetzt keine Rechtsberatung. Inhalte wurden nach Ihren Angaben
                                umgesetzt.
                            </p>
                        </aside>
                    </div>
                </section>
            </main>
        </>
    );
}

function Card({ children }) {
    return (
        <div className="rounded-3xl border border-primary-100 bg-white p-6 shadow-[0_18px_60px_rgba(15,23,42,0.06)]">
            {children}
        </div>
    );
}
