// pages/karriere/index.jsx
import Head from "next/head";

import { sanityClient } from "@/client";
import { careerPageQuery } from "@/libs/queries";

import DetailHero from "@/sections/heroDetail";
import InfoBar from "@/sections/infoBar";
import AppointmentCTASection from "@/sections/cta";

// Du sagst: Cards existieren schon
// Beispiel: import JobCard from "@/components/jobs/JobCard";
import JobCard from "@/components/jobCard";

// Deine bestehende TextImage Section (bitte Pfad ggf. anpassen)
import TextImageSection from "@/sections/textImageFull";

export async function getStaticProps() {
    const data = await sanityClient.fetch(careerPageQuery);

    return {
        props: { data },
        revalidate: 60,
    };
}

export default function CareerPage({ data }) {
    const page = data?.page;
    if (!page) return null;

    console.log(data);

    const heroImage = page.heroImage || page.seo?.ogImage;

    const title = page?.seo?.title || page.heroTitle || "Karriere";
    const description = page?.seo?.description || page.heroSubtitle || "";

    return (
        <>
            <Head>
                <title>{title}</title>
                {description ? <meta name="description" content={description} /> : null}
            </Head>

            <DetailHero title={page.heroTitle} subtitle={page.heroSubtitle} image={heroImage} />
            <InfoBar />

            {/* Offene Stellen */}
            <section className="py-16 md:py-20">
                <div className="mx-auto max-w-6xl px-4 md:px-6 lg:px-8">
                    <h2 className="mb-10 font-thin text-delft text-3xl sm:text-4xl">Offene Stellen</h2>

                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {(page.openPositions || []).map((job, idx) => (
                            <JobCard key={job?._id || job?._key || idx} job={job} />
                        ))}
                    </div>
                </div>
            </section>

            {/* 2 Text Sections unten */}
            <section className="py-16 md:py-24">
                <div className="mx-auto max-w-6xl px-4 md:px-6 lg:px-8">
                    <div className="grid gap-12 md:grid-cols-2 md:gap-16">
                        <TextImageSection section={page.sectionLeft} />
                    </div>
                </div>
            </section>

            <AppointmentCTASection />
        </>
    );
}
