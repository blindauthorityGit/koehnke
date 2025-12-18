// pages/neupatienten.js
import Head from "next/head";

import { sanityClient } from "@/client";
import { patientInfoPageQuery } from "@/libs/queries";

import InfoBar from "@/sections/infoBar";
import AppointmentCTASection from "@/sections/cta";

// dein Detail Hero
import DetailHero from "@/sections/heroDetail";

// deine bestehende Sektion
import TextImageSectionFull from "@/sections/textImageFull";

// FAQ Section
import FaqSection from "@/sections/faqs";

export async function getStaticProps() {
    const data = await sanityClient.fetch(patientInfoPageQuery);

    return {
        props: { data },
        revalidate: 60,
    };
}

export default function NeupatientenPage({ data }) {
    const page = data?.page;
    if (!page) return null;
    console.log(data);
    const heroImage = page.heroImage || page.seo?.ogImage;

    const title = page?.seo?.title || page.heroTitle || "Neupatienten";
    const description = page?.seo?.description || page.heroSubtitle || "";

    return (
        <>
            <Head>
                <title>{title}</title>
                {description ? <meta name="description" content={description} /> : null}
            </Head>

            <DetailHero title={page.heroTitle} subtitle={page.heroSubtitle} image={heroImage} />
            <InfoBar />

            {/* Text/Image (wie gehabt) */}
            {page.introSection ? <TextImageSectionFull section={page.introSection} whiteBG /> : null}

            {/* FAQ */}
            <FaqSection faqs={page.faqs} />

            <AppointmentCTASection />
        </>
    );
}
