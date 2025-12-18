// pages/leistungen.js
import { sanityClient } from "@/client";
import PageHero from "@/sections/heroPages";
import InfoBar from "@/sections/infoBar";
import ServicesOverview from "@/sections/servicesAll"; // wenn du den Alias nutzt
import TextImageSectionFull from "@/sections/textImageFull";

import { serviceQuery } from "@/libs/queries";
import AppointmentCTASection from "@/sections/cta";

export async function getStaticProps() {
    const data = await sanityClient.fetch(serviceQuery);

    console.log("SANITY DATA", data);

    return {
        props: { data },
        revalidate: 60,
    };
}

export default function LeistungenPage({ data }) {
    console.log(data);
    const { page, services } = data;
    const heroImage = page.heroImage || page.seo?.ogImage; // Fallback auf SEO-OG-Bild

    return (
        <>
            <PageHero title={page.heroTitle} subtitle={page.heroSubtitle} image={heroImage} />
            <InfoBar />
            <ServicesOverview services={services} />
            {page.sections?.map((section, index) => (
                <TextImageSectionFull
                    key={section._key || index}
                    section={section}
                    id={`tis-${section._key || index}`}
                    whiteBG
                    // withWave
                />
            ))}{" "}
            <AppointmentCTASection> </AppointmentCTASection>
        </>
    );
}
