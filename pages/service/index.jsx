// pages/service.js
import Head from "next/head";

import { sanityClient } from "@/client";
import { patientServicesPageQuery } from "@/libs/queries";

import PageHero from "@/sections/heroPages";
import InfoBar from "@/sections/infoBar";
import AppointmentCTASection from "@/sections/cta";

import ServiceCard from "@/components/serviceCard";
import TextImageSectionFull from "@/sections/textImageFull";

export async function getStaticProps() {
    const data = await sanityClient.fetch(patientServicesPageQuery);
    console.log(data);
    return {
        props: { data },
        revalidate: 60,
    };
}

export default function PatientServicesPage({ data }) {
    const page = data?.page;
    if (!page) return null;
    console.log(data);

    const heroImage = page.heroImage || page.seo?.ogImage;

    const title = page?.seo?.title || page.heroTitle || "Patienten Services";
    const description = page?.seo?.description || page.heroSubtitle || "";

    return (
        <>
            <Head>
                <title>{title}</title>
                {description ? <meta name="description" content={description} /> : null}
            </Head>

            <PageHero title={page.heroTitle} subtitle={page.heroSubtitle} image={heroImage} />
            <InfoBar />

            {/* Cards */}
            <section className="py-16 md:py-20">
                <div className="mx-auto max-w-6xl px-4 md:px-6 lg:px-8">
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {page.cards?.map((card, idx) => (
                            <ServiceCard key={card?._key || idx} card={card} />
                        ))}
                    </div>
                </div>
            </section>

            {/* Bottom Text/Image/Buttons */}
            <TextImageSectionFull
                section={page.imgTextSection}
                whiteBG
                // withWave
            />

            <AppointmentCTASection />
        </>
    );
}
