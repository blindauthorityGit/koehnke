import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

import { H1 } from "@/typography/headlines";
import { hyphenateTitle } from "@/utils/hyphenateTitle";
import { buildMapTilerStaticUrl } from "@/utils/maptiler";

import ContactMapEmbed from "@/components/maps/contactMapEmbeded";

export default function ContactHero({ page }) {
    const [loaded, setLoaded] = useState(false);

    console.log(page);

    // Immer safe destructuren, auch wenn page mal null ist
    const headline = page?.headline || "Kontakt";
    const intro = page?.intro || "";
    const contact = page?.contact || {};
    const openingHours = Array.isArray(page?.openingHours) ? page.openingHours : [];
    const cta = page?.cta || {};
    const map = page?.map || {};

    const displayTitle = hyphenateTitle(headline);

    const mapUrl = buildMapTilerStaticUrl({
        lat: map?.lat,
        lng: map?.lng,
        zoom: map?.zoom ?? 16,
        size: 1200, // etwas höher für gestochen scharf im Kreis
    });

    const directionsUrl =
        map?.lat && map?.lng ? `https://www.google.com/maps/dir/?api=1&destination=${map.lat},${map.lng}` : null;

    return (
        <section className="bg-primary-50 pt-12 pb-20">
            <div
                className="
          container mx-auto px-4 md:px-6 lg:px-10
          flex flex-col md:flex-row
          items-center gap-16
        "
            >
                {/* MAP */}
                <div className="w-full md:w-7/12">
                    <a
                        href={`https://www.google.com/maps/dir/?api=1&destination=${map.lat},${map.lng}`}
                        target="_blank"
                        rel="noreferrer"
                        aria-label="Route planen"
                    >
                        <ContactMapEmbed lat={map?.lat} lng={map?.lng} zoom={map?.zoom ?? 16} />
                    </a>
                    <p className="mt-2 text-xs text-slate-500">Karte wird über MapTiler / OpenStreetMap geladen.</p>
                </div>

                {/* TEXT */}
                <div className="w-full md:w-5/12 text-delft">
                    <H1 className="font-thin text-3xl sm:text-4xl md:text-5xl lg:text-6xl leading-snug">
                        {displayTitle}
                    </H1>

                    {intro && <p className="mt-6 text-base md:text-lg leading-relaxed whitespace-pre-line">{intro}</p>}

                    {/* Adresse */}
                    <div className="mt-10 text-sm leading-relaxed">
                        {contact?.practiceName && <div className="font-semibold">{contact.practiceName}</div>}
                        {contact?.street && <div>{contact.street}</div>}
                        {(contact?.zip || contact?.city) && (
                            <div>
                                {contact?.zip ? `${contact.zip} ` : ""}
                                {contact?.city || ""}
                            </div>
                        )}
                    </div>

                    {/* Kontakt */}
                    <div className="mt-6 space-y-2 text-sm">
                        {contact?.phone && (
                            <div>
                                <strong>Telefon:</strong>{" "}
                                <a
                                    href={`tel:${String(contact.phone).replace(/[^\d+]/g, "")}`}
                                    className="underline underline-offset-2"
                                >
                                    {contact.phone}
                                </a>
                            </div>
                        )}
                        {contact?.email && (
                            <div>
                                <strong>E-Mail:</strong>{" "}
                                <a href={`mailto:${contact.email}`} className="underline underline-offset-2">
                                    {contact.email}
                                </a>
                            </div>
                        )}
                    </div>

                    {/* Öffnungszeiten */}
                    {openingHours.length > 0 && (
                        <div className="mt-8">
                            <div className="font-semibold text-sm">Öffnungszeiten</div>
                            <div className="mt-3 space-y-2 text-sm">
                                {openingHours.map((row, i) => (
                                    <div key={i} className="flex gap-6">
                                        <div className="w-[110px]">{row?.days || "—"}</div>
                                        <div>{row?.time || "—"}</div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* CTA */}
                    {cta?.label && cta?.link && (
                        <div className="mt-10">
                            <Link
                                href={cta.link}
                                className="inline-flex items-center justify-center rounded-xl bg-delft px-6 py-3 text-white text-sm font-semibold hover:opacity-90 transition"
                            >
                                {cta.label}
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
}
