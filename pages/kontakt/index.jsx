// pages/kontakt.js (oder pages/kontakt/index.js)
import { sanityClient } from "@/client";
import { contactPageQuery } from "@/libs/queries";

import Seo from "@/components/seo";
import { mapSanitySeoToSeoProps } from "@/helpers/seoMap"; // wie zuvor

import ContactHero from "@/sections/contactHero";

export async function getStaticProps() {
    const contactPage = await sanityClient.fetch(contactPageQuery);

    return {
        props: {
            contactPage: contactPage || null,
        },
        revalidate: 60,
    };
}

export default function Kontakt({ contactPage }) {
    if (!contactPage) return null;

    // Falls dein contactPage ein seo-Objekt hat (empfohlen), wird es genutzt:
    const sanitySeo = contactPage?.seo || null;

    const fallbackTitle = contactPage?.seo?.metaTitle || contactPage?.title || "Kontakt";

    const fallbackDescription =
        contactPage?.seo?.metaDescription ||
        contactPage?.intro ||
        "Kontakt, Anfahrt und Öffnungszeiten – Zentrum für Zahnmedizin Dr. Köhnke & Kollegen.";

    const fallbackUrl = "https://www.zahnarztpraxis-hattersheim.de/kontakt";

    const seoProps = mapSanitySeoToSeoProps({
        seo: sanitySeo,
        fallbackTitle,
        fallbackDescription,
        fallbackUrl,
    });

    return (
        <>
            <Seo {...seoProps} />

            <main>
                <ContactHero page={contactPage} />
            </main>
        </>
    );
}
