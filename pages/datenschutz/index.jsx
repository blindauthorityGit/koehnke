import Head from "next/head";
import Link from "next/link";

export default function DatenschutzPage() {
    return (
        <>
            <Head>
                <title>Datenschutzerklärung | Zahnarzt Köhnke</title>
                <meta
                    name="description"
                    content="Datenschutzerklärung der Website der Zahnarztpraxis Dr. Köhnke & Kollegen."
                />
                <meta name="robots" content="index,follow" />
            </Head>

            <main className="mx-auto max-w-4xl px-4 py-12 md:py-16">
                {/* Breadcrumb / Back link optional */}
                <div className="mb-8 text-sm">
                    <Link href="/" className="text-[#0B2A4A] underline underline-offset-4">
                        Zur Startseite
                    </Link>
                </div>

                <h1 className="mb-4 text-3xl font-semibold tracking-tight text-[#0B2A4A] md:text-4xl">
                    Datenschutzerklärung
                </h1>
                <p className="mb-10 text-base leading-relaxed text-slate-700">
                    Stand: {new Date().toLocaleDateString("de-DE")}
                </p>

                <section className="mb-10">
                    <h2 className="mb-3 text-xl font-semibold text-[#0B2A4A]">1. Verantwortlicher</h2>
                    <div className="rounded-2xl bg-slate-50 p-5 text-slate-800">
                        <p className="font-medium">Zentrum für Zahnmedizin, Dr. Köhnke & Kollegen MVZ-GmbH</p>
                        <p>Schulstrasse 43, 65795 Hattersheim am Main</p>
                        <p>Telefon: 06190-989500</p>
                        <p>
                            E-Mail:{" "}
                            <a className="underline underline-offset-4" href="mailto:info@zahnarzt-koehnke.de">
                                info@zahnarzt-koehnke.de
                            </a>
                        </p>
                        <p>Internet: www.zahnarztpraxis-hattersheim.de</p>
                    </div>
                </section>

                <section className="mb-10">
                    <h2 className="mb-3 text-xl font-semibold text-[#0B2A4A]">2. Datenschutzbeauftragter</h2>
                    <p className="leading-relaxed text-slate-700">
                        Sofern für unser Unternehmen kein Datenschutzbeauftragter bestellt wurde, kannst du dich bei
                        Fragen zum Datenschutz direkt an den Verantwortlichen (siehe oben) wenden. Falls ein
                        Datenschutzbeauftragter bestellt ist, werden die Kontaktdaten hier ergänzt.
                    </p>
                </section>

                <section className="mb-10">
                    <h2 className="mb-3 text-xl font-semibold text-[#0B2A4A]">
                        3. Allgemeine Hinweise zur Datenverarbeitung
                    </h2>
                    <ul className="list-disc space-y-2 pl-5 text-slate-700">
                        <li>
                            Wir verarbeiten personenbezogene Daten nur, soweit dies zur Bereitstellung dieser Website,
                            zur Kommunikation, zur Terminorganisation, zur Bearbeitung von Anfragen sowie zur Erfüllung
                            gesetzlicher Pflichten erforderlich ist.
                        </li>
                        <li>
                            Rechtsgrundlagen sind insbesondere Art. 6 Abs. 1 lit. a DSGVO (Einwilligung), Art. 6 Abs. 1
                            lit. b DSGVO (Vertrag/Anbahnung), Art. 6 Abs. 1 lit. c DSGVO (rechtliche Verpflichtung)
                            sowie Art. 6 Abs. 1 lit. f DSGVO (berechtigtes Interesse, z. B. IT-Sicherheit und stabiler
                            Websitebetrieb).
                        </li>
                    </ul>
                </section>

                <section className="mb-10">
                    <h2 className="mb-3 text-xl font-semibold text-[#0B2A4A]">4. Zugriffsdaten / Server-Logfiles</h2>
                    <p className="leading-relaxed text-slate-700">
                        Beim Aufruf unserer Website werden durch den Hosting-Anbieter automatisch Daten erfasst (sog.
                        Server-Logfiles). Dazu können gehören: IP-Adresse, Datum und Uhrzeit der Anfrage, aufgerufene
                        Seite/Datei, Referrer-URL, Browsertyp/-version, Betriebssystem sowie technische
                        Statusinformationen. Diese Verarbeitung erfolgt zur Gewährleistung von Sicherheit, Stabilität
                        und Fehleranalyse (Art. 6 Abs. 1 lit. f DSGVO).
                    </p>
                </section>

                <section className="mb-10">
                    <h2 className="mb-3 text-xl font-semibold text-[#0B2A4A]">5. Hosting (Vercel)</h2>
                    <p className="leading-relaxed text-slate-700">
                        Diese Website wird über einen externen Dienstleister gehostet (Vercel). Dabei werden die für den
                        Betrieb erforderlichen Daten (z. B. Logfiles) auf Servern des Dienstleisters verarbeitet. Die
                        Verarbeitung erfolgt auf Grundlage unseres berechtigten Interesses an einer sicheren und
                        effizienten Bereitstellung der Website (Art. 6 Abs. 1 lit. f DSGVO).
                    </p>
                    <p className="mt-3 leading-relaxed text-slate-700">
                        Hinweis zu Drittlandtransfers: Je nach eingesetzter Infrastruktur können Daten auch außerhalb
                        der EU/des EWR verarbeitet werden. In solchen Fällen stellen wir sicher, dass geeignete
                        Garantien (z. B. Standardvertragsklauseln) vereinbart sind.
                    </p>
                </section>

                <section className="mb-10">
                    <h2 className="mb-3 text-xl font-semibold text-[#0B2A4A]">6. Content-Management (Sanity)</h2>
                    <p className="leading-relaxed text-slate-700">
                        Für die Pflege bestimmter Inhalte nutzen wir ein Headless-CMS (Sanity). Dabei werden Inhalte und
                        – je nach Nutzung – auch technische Metadaten verarbeitet. Zugriff auf das CMS erfolgt nur für
                        berechtigte Personen. Rechtsgrundlage ist Art. 6 Abs. 1 lit. f DSGVO (effiziente, sichere
                        Inhaltsverwaltung).
                    </p>
                    <p className="mt-3 leading-relaxed text-slate-700">
                        Hinweis zu Drittlandtransfers: Sanity kann Daten außerhalb der EU/des EWR verarbeiten. In
                        solchen Fällen erfolgt die Absicherung über geeignete Garantien (z. B.
                        Standardvertragsklauseln).
                    </p>
                </section>

                <section className="mb-10">
                    <h2 className="mb-3 text-xl font-semibold text-[#0B2A4A]">
                        7. Kontaktaufnahme (E-Mail / Kontaktformular)
                    </h2>
                    <p className="leading-relaxed text-slate-700">
                        Wenn du uns per E-Mail oder über ein Formular kontaktierst, verarbeiten wir die von dir
                        übermittelten Daten (z. B. Name, E-Mail-Adresse, Telefonnummer, Nachricht), um dein Anliegen zu
                        bearbeiten. Rechtsgrundlage ist Art. 6 Abs. 1 lit. b DSGVO (Anbahnung/Erfüllung eines Vertrags)
                        bzw. Art. 6 Abs. 1 lit. f DSGVO (allgemeine Kommunikation).
                    </p>
                    <p className="mt-3 leading-relaxed text-slate-700">
                        Wir speichern Anfragen nur so lange, wie dies zur Bearbeitung erforderlich ist und gesetzliche
                        Aufbewahrungspflichten nicht entgegenstehen.
                    </p>
                </section>

                <section className="mb-10">
                    <h2 className="mb-3 text-xl font-semibold text-[#0B2A4A]">8. Online-Terminbuchung</h2>
                    <p className="leading-relaxed text-slate-700">
                        Auf unserer Website kann eine Online-Terminbuchung angeboten werden.
                    </p>
                    <p className="leading-relaxed text-slate-700">
                        Wenn Terminwünsche über ein internes Formular an uns gesendet werden, gilt Abschnitt
                        „Kontaktaufnahme“ entsprechend (Art. 6 Abs. 1 lit. b DSGVO).{" "}
                    </p>
                </section>

                <section className="mb-10">
                    <h2 className="mb-3 text-xl font-semibold text-[#0B2A4A]">9. Online-Anamnese</h2>
                    <p className="leading-relaxed text-slate-700">
                        Sofern wir einen Online-Anamnesebogen anbieten, verarbeiten wir die von dir gemachten Angaben
                        zur Vorbereitung und Organisation der Behandlung. Dabei können – je nach konkreter Ausgestaltung
                        – auch besondere Kategorien personenbezogener Daten (Gesundheitsdaten) betroffen sein.
                    </p>
                    <ul className="mt-3 list-disc space-y-2 pl-5 text-slate-700">
                        <li>
                            Rechtsgrundlage ist regelmäßig Art. 6 Abs. 1 lit. b DSGVO (Behandlungs-/Vertragsanbahnung)
                            sowie – sofern Gesundheitsdaten betroffen sind – Art. 9 Abs. 2 DSGVO i. V. m. den
                            einschlägigen berufsrechtlichen Regelungen.
                        </li>
                        <li>Übermittlungen erfolgen verschlüsselt (TLS), soweit technisch verfügbar.</li>
                        <li>
                            Die Speicherdauer richtet sich nach medizinischen und gesetzlichen Aufbewahrungspflichten.
                        </li>
                    </ul>
                </section>

                <section className="mb-10">
                    <h2 className="mb-3 text-xl font-semibold text-[#0B2A4A]">
                        10. Bewerbungen (Online-Bewerbungsformular)
                    </h2>
                    <p className="leading-relaxed text-slate-700">
                        Wenn du dich über unsere Website bewirbst, verarbeiten wir die von dir übermittelten Daten (z.
                        B. Kontaktdaten, Lebenslauf, Zeugnisse und ggf. weitere Angaben) ausschließlich zur Durchführung
                        des Bewerbungsverfahrens.
                    </p>
                    <ul className="mt-3 list-disc space-y-2 pl-5 text-slate-700">
                        <li>
                            Rechtsgrundlage: Art. 6 Abs. 1 lit. b DSGVO (Anbahnung eines Beschäftigungsverhältnisses).
                        </li>
                        <li>
                            Empfänger: Intern zuständige Personen/Stellen. Dienstleister (z. B.
                            Hosting/Storage/E-Mail-Versand) nur im Rahmen einer Auftragsverarbeitung.
                        </li>
                        <li>
                            Speicherdauer: In der Regel bis Abschluss des Verfahrens; bei Absage ggf. für einen
                            begrenzten Zeitraum zur Abwehr/Begründung rechtlicher Ansprüche (Art. 6 Abs. 1 lit. f
                            DSGVO), sofern erforderlich.
                        </li>
                    </ul>
                </section>

                <section className="mb-10">
                    <h2 className="mb-3 text-xl font-semibold text-[#0B2A4A]">11. Karten/Standort (Google Maps)</h2>
                    <p className="leading-relaxed text-slate-700">
                        Wenn wir eine Karte (z. B. Google Maps) einbinden, kann beim Laden der Karte deine IP-Adresse an
                        den Kartenanbieter übertragen werden. Je nach Einbindung können auch Cookies/Identifiers gesetzt
                        werden.
                    </p>
                </section>

                <section className="mb-10">
                    <h2 className="mb-3 text-xl font-semibold text-[#0B2A4A]">12. Cookies / Tracking</h2>
                    <p className="leading-relaxed text-slate-700">
                        Wir setzen – sofern nicht ausdrücklich anders angegeben – keine Analyse- oder
                        Marketing-Tracking-Tools (z. B. Google Analytics) ein. Technisch notwendige Cookies können je
                        nach eingesetzten Komponenten (z. B. Sicherheits-/Session-Cookies) erforderlich sein.
                    </p>
                    <p className="mt-3 leading-relaxed text-slate-700">
                        Falls zukünftig Analyse- oder Marketing-Tools eingesetzt werden, erfolgt dies nur mit einer
                        entsprechenden Einwilligung über ein Consent-Banner (Art. 6 Abs. 1 lit. a DSGVO).
                    </p>
                </section>

                <section className="mb-10">
                    <h2 className="mb-3 text-xl font-semibold text-[#0B2A4A]">13. Empfänger / Auftragsverarbeiter</h2>
                    <p className="leading-relaxed text-slate-700">
                        Wir setzen Dienstleister ein, die personenbezogene Daten in unserem Auftrag verarbeiten (z. B.
                        Hosting, CMS, E-Mail-Versand). Mit diesen Dienstleistern bestehen – soweit erforderlich –
                        Verträge zur Auftragsverarbeitung gemäß Art. 28 DSGVO.
                    </p>
                </section>

                <section className="mb-10">
                    <h2 className="mb-3 text-xl font-semibold text-[#0B2A4A]">14. Deine Rechte</h2>
                    <ul className="list-disc space-y-2 pl-5 text-slate-700">
                        <li>Auskunft (Art. 15 DSGVO)</li>
                        <li>Berichtigung (Art. 16 DSGVO)</li>
                        <li>Löschung (Art. 17 DSGVO)</li>
                        <li>Einschränkung der Verarbeitung (Art. 18 DSGVO)</li>
                        <li>Datenübertragbarkeit (Art. 20 DSGVO)</li>
                        <li>Widerspruch gegen bestimmte Verarbeitungen (Art. 21 DSGVO)</li>
                        <li>Widerruf von Einwilligungen mit Wirkung für die Zukunft (Art. 7 Abs. 3 DSGVO)</li>
                    </ul>
                </section>

                <section className="mb-10">
                    <h2 className="mb-3 text-xl font-semibold text-[#0B2A4A]">
                        15. Beschwerderecht bei der Aufsichtsbehörde
                    </h2>
                    <p className="leading-relaxed text-slate-700">
                        Du hast das Recht, dich bei einer Datenschutz-Aufsichtsbehörde zu beschweren. Zuständig ist in
                        der Regel die Aufsichtsbehörde am Sitz unseres Unternehmens bzw. deines gewöhnlichen
                        Aufenthalts.
                    </p>

                    <div className="mt-4 rounded-2xl bg-slate-50 p-5 text-slate-800">
                        <p className="font-medium">
                            Der Hessische Beauftragte für Datenschutz und Informationsfreiheit
                        </p>
                        <p>Gustav-Stresemann-Ring 1, 65189 Wiesbaden</p>
                        <p>Telefon: 0611 1408-0</p>
                        <p>
                            E-Mail:{" "}
                            <a className="underline underline-offset-4" href="mailto:poststelle@datenschutz.hessen.de">
                                poststelle@datenschutz.hessen.de
                            </a>
                        </p>
                    </div>
                </section>

                <section className="mb-2">
                    <h2 className="mb-3 text-xl font-semibold text-[#0B2A4A]">
                        16. Änderungen dieser Datenschutzerklärung
                    </h2>
                    <p className="leading-relaxed text-slate-700">
                        Wir passen diese Datenschutzerklärung an, sobald Änderungen an der Website, den eingesetzten
                        Diensten oder rechtlichen Vorgaben dies erforderlich machen.
                    </p>
                </section>

                <hr className="my-10 border-slate-200" />

                <p className="text-sm text-slate-500">
                    Hinweis: Diese Vorlage ersetzt keine Rechtsberatung. Für eine finale rechtliche Prüfung
                    (insbesondere bei Online-Anamnese/Patientendaten, Termin-Tools, Consent-Management) empfehlen wir
                    eine Prüfung durch eine juristisch qualifizierte Stelle.
                </p>
            </main>
        </>
    );
}
