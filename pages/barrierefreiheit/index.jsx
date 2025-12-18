import Head from "next/head";
import Link from "next/link";

export default function BarrierefreiheitPage() {
    return (
        <>
            <Head>
                <title>Erklärung zur Barrierefreiheit | Zahnarzt Köhnke</title>
                <meta
                    name="description"
                    content="Erklärung zur Barrierefreiheit der Website der Zahnarztpraxis Dr. Köhnke & Kollegen."
                />
                <meta name="robots" content="index,follow" />
            </Head>

            <main className="mx-auto max-w-4xl px-4 py-12 md:py-16">
                <div className="mb-8 text-sm">
                    <Link href="/" className="text-[#0B2A4A] underline underline-offset-4">
                        Zur Startseite
                    </Link>
                </div>

                <h1 className="mb-4 text-3xl font-semibold tracking-tight text-[#0B2A4A] md:text-4xl">
                    Erklärung zur Barrierefreiheit
                </h1>

                <p className="mb-10 text-base leading-relaxed text-slate-700">
                    Stand: {new Date().toLocaleDateString("de-DE")}
                </p>

                <section className="mb-10">
                    <p className="leading-relaxed text-slate-700">
                        Das Zentrum für Zahnmedizin, Dr. Köhnke & Kollegen MVZ-GmbH ist bemüht, seine Website im
                        Einklang mit den geltenden gesetzlichen Vorgaben zur Barrierefreiheit barrierefrei zugänglich zu
                        machen.
                    </p>
                </section>

                <section className="mb-10">
                    <h2 className="mb-3 text-xl font-semibold text-[#0B2A4A]">Geltungsbereich</h2>
                    <p className="leading-relaxed text-slate-700">
                        Diese Erklärung zur Barrierefreiheit gilt für die Website:
                        <br />
                        <span className="font-medium">www.zahnarztpraxis-hattersheim.de</span>
                    </p>
                </section>

                <section className="mb-10">
                    <h2 className="mb-3 text-xl font-semibold text-[#0B2A4A]">
                        Stand der Vereinbarkeit mit den Anforderungen
                    </h2>
                    <p className="leading-relaxed text-slate-700">
                        Diese Website ist <strong>teilweise barrierefrei</strong>. Sie entspricht in weiten Teilen den
                        Anforderungen der
                        <strong> WCAG 2.1 auf Konformitätsstufe AA</strong>
                        sowie den einschlägigen nationalen Umsetzungsregelungen (z. B. BFSG / BITV).
                    </p>
                </section>

                <section className="mb-10">
                    <h2 className="mb-3 text-xl font-semibold text-[#0B2A4A]">Nicht barrierefreie Inhalte</h2>
                    <p className="leading-relaxed text-slate-700">
                        Die nachstehend aufgeführten Inhalte sind derzeit noch nicht vollständig barrierefrei:
                    </p>

                    <ul className="mt-4 list-disc space-y-2 pl-5 text-slate-700">
                        <li>
                            Eingebundene Karten (z. B. Google Maps) sind nicht vollständig mit Screenreadern nutzbar.
                        </li>
                        <li>PDF-Dokumente (z. B. Download-Formulare) sind teilweise nicht barrierefrei aufbereitet.</li>
                        <li>
                            Einzelne interaktive Elemente können in Ausnahmefällen noch nicht vollständig per Tastatur
                            bedienbar sein.
                        </li>
                        <li>Alternativtexte für Bilder werden laufend überprüft und ergänzt.</li>
                    </ul>

                    <p className="mt-4 leading-relaxed text-slate-700">
                        Wir arbeiten kontinuierlich daran, diese Barrieren zu identifizieren und zu reduzieren.
                    </p>
                </section>

                <section className="mb-10">
                    <h2 className="mb-3 text-xl font-semibold text-[#0B2A4A]">Erstellung dieser Erklärung</h2>
                    <p className="leading-relaxed text-slate-700">
                        Diese Erklärung wurde auf Grundlage einer
                        <strong> Selbstbewertung</strong> erstellt. Die Bewertung erfolgte anhand der WCAG-2.1-Kriterien
                        sowie technischer Prüfungen (u. a. Tastaturnavigation, Kontrastverhältnisse, semantische
                        Struktur).
                    </p>
                </section>

                <section className="mb-10">
                    <h2 className="mb-3 text-xl font-semibold text-[#0B2A4A]">Feedback und Kontakt</h2>
                    <p className="leading-relaxed text-slate-700">
                        Wenn dir Mängel in Bezug auf die barrierefreie Gestaltung unserer Website auffallen oder du
                        Informationen zu nicht barrierefreien Inhalten benötigst, kannst du dich gerne bei uns melden.
                    </p>

                    <div className="mt-4 rounded-2xl bg-slate-50 p-5 text-slate-800">
                        <p className="font-medium">Zentrum für Zahnmedizin, Dr. Köhnke & Kollegen MVZ-GmbH</p>
                        <p>Schulstrasse 43, 65795 Hattersheim am Main</p>
                        <p>Telefon: 06190-989500</p>
                        <p>
                            E-Mail:{" "}
                            <a href="mailto:info@zahnarzt-koehnke.de" className="underline underline-offset-4">
                                info@zahnarzt-koehnke.de
                            </a>
                        </p>
                    </div>
                </section>

                <section className="mb-10">
                    <h2 className="mb-3 text-xl font-semibold text-[#0B2A4A]">Durchsetzungsverfahren</h2>
                    <p className="leading-relaxed text-slate-700">
                        Solltest du der Ansicht sein, durch eine nicht ausreichende barrierefreie Gestaltung unserer
                        Website benachteiligt zu sein und innerhalb einer angemessenen Frist keine zufriedenstellende
                        Antwort erhalten haben, kannst du dich an die zuständige Durchsetzungsstelle wenden.
                    </p>

                    <div className="mt-4 rounded-2xl bg-slate-50 p-5 text-slate-800">
                        <p className="font-medium">Durchsetzungsstelle Barrierefreie Informationstechnik Hessen</p>
                        <p>beim Hessischen Beauftragten für Datenschutz und Informationsfreiheit</p>
                        <p>Gustav-Stresemann-Ring 1, 65189 Wiesbaden</p>
                        <p>
                            Website:{" "}
                            <a
                                href="https://datenschutz.hessen.de"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="underline underline-offset-4"
                            >
                                datenschutz.hessen.de
                            </a>
                        </p>
                    </div>
                </section>

                <hr className="my-10 border-slate-200" />

                <p className="text-sm text-slate-500">
                    Hinweis: Diese Erklärung wird regelmäßig überprüft und bei technischen oder inhaltlichen Änderungen
                    der Website angepasst.
                </p>
            </main>
        </>
    );
}
