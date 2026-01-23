// pages/karriere/index.jsx

import { sanityClient } from "@/client";
import { careerPageQuery } from "@/libs/queries";

import Seo from "@/components/seo";
import { mapSanitySeoToSeoProps } from "@/helpers/seoMap";

import DetailHero from "@/sections/heroDetail";
import InfoBar from "@/sections/infoBar";
import AppointmentCTASection from "@/sections/cta";

import JobCard from "@/components/jobCard";
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

    const sanitySeo = page?.seo || null;

    const heroImage = page?.heroImage || page?.seo?.ogImage || null;

    const fallbackTitle = page?.heroTitle || page?.title || "Karriere";

    const fallbackDescription =
        page?.seo?.metaDescription ||
        page?.heroSubtitle ||
        "Karriere in unserer Zahnarztpraxis – offene Stellen und Arbeiten in einem modernen, freundlichen Team.";

    const fallbackUrl = "https://www.zahnarztpraxis-hattersheim.de/karriere";

    const seoProps = mapSanitySeoToSeoProps({
        seo: sanitySeo,
        fallbackTitle,
        fallbackDescription,
        fallbackUrl,
    });

    return (
        <>
            <Seo {...seoProps} />

            <DetailHero title={page?.heroTitle} subtitle={page?.heroSubtitle} image={heroImage} />

            <InfoBar />

            {/* Offene Stellen */}
            <section className="py-16 md:py-20">
                <div className="mx-auto max-w-6xl px-4 md:px-6 lg:px-8">
                    <h2 className="mb-10 font-thin text-delft text-3xl sm:text-4xl">Offene Stellen</h2>

                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {(page?.openPositions || []).map((job, idx) => (
                            <JobCard key={job?._id || job?._key || idx} job={job} />
                        ))}
                    </div>
                </div>
            </section>

            {/* Text Sections unten */}
            <section className="py-16 md:py-24">
                <div className="mx-auto max-w-6xl px-4 md:px-6 lg:px-8">
                    <div className="grid gap-12 md:grid-cols-2 md:gap-16">
                        <TextImageSection section={page?.sectionLeft} />
                        {/* Falls es rechts auch etwas gibt: */}
                        {/* <TextImageSection section={page?.sectionRight} /> */}
                    </div>
                </div>
            </section>

            <AppointmentCTASection />
        </>
    );
}
