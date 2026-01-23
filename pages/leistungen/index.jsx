// pages/leistungen.js
import { sanityClient } from "@/client";

import Seo from "@/components/seo";
import { mapSanitySeoToSeoProps } from "@/helpers/seoMap"; // wie zuvor angelegt

import PageHero from "@/sections/heroPages";
import InfoBar from "@/sections/infoBar";
import ServicesOverview from "@/sections/servicesAll";
import TextImageSectionFull from "@/sections/textImageFull";
import AppointmentCTASection from "@/sections/cta";

import { serviceQuery } from "@/libs/queries";

export async function getStaticProps() {
    const data = await sanityClient.fetch(serviceQuery);

    return {
        props: { data },
        revalidate: 60,
    };
}

export default function LeistungenPage({ data }) {
    const { page, services } = data || {};
    const sanitySeo = page?.seo || null;

    // Hero-Bild: Page-Hero-Image bevorzugen, sonst SEO OG Image
    const heroImage = page?.heroImage || page?.seo?.ogImage;

    // Fallbacks (wenn Sanity-Felder fehlen)
    const fallbackTitle = page?.heroTitle || page?.title || "Leistungen";

    const fallbackDescription =
        page?.seo?.metaDescription ||
        "Unsere Leistungen im Überblick – moderne Zahnmedizin, persönliche Betreuung und einfühlsame Behandlung.";

    // Canonical URL für diese Seite (bitte exakt so wie deine Route öffentlich ist)
    const fallbackUrl = "https://www.zahnarztpraxis-hattersheim.de/leistungen";

    const seoProps = mapSanitySeoToSeoProps({
        seo: sanitySeo,
        fallbackTitle,
        fallbackDescription,
        fallbackUrl,
    });

    return (
        <>
            <Seo {...seoProps} />

            <PageHero title={page?.heroTitle} subtitle={page?.heroSubtitle} image={heroImage} />

            <InfoBar />

            <ServicesOverview services={services || []} />

            {page?.sections?.map((section, index) => (
                <TextImageSectionFull
                    key={section._key || index}
                    section={section}
                    id={`tis-${section._key || index}`}
                    whiteBG
                />
            ))}

            <AppointmentCTASection />
        </>
    );
}
