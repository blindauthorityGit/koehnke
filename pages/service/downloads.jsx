// pages/service/downloads.js
import Head from "next/head";

import { sanityClient } from "@/client";
import { downloadsPageQuery } from "@/libs/queries";

import DetailHero from "@/sections/heroDetail";
import InfoBar from "@/sections/infoBar";
import AppointmentCTASection from "@/sections/cta";

import DownloadCard from "@/components/downloadCard";

export async function getStaticProps() {
    const data = await sanityClient.fetch(downloadsPageQuery);

    return {
        props: { data },
        revalidate: 60,
    };
}

export default function DownloadsPage({ data }) {
    const page = data?.page;
    if (!page) return null;

    const heroImage = page.heroImage || page.seo?.ogImage;

    const title = page?.seo?.title || page.heroTitle || "Downloads & Formulare";
    const description = page?.seo?.description || page.heroSubtitle || "";

    return (
        <>
            <Head>
                <title>{title}</title>
                {description ? <meta name="description" content={description} /> : null}
            </Head>

            <DetailHero title={page.heroTitle} subtitle={page.heroSubtitle} image={heroImage} />
            <InfoBar />

            {/* Cards */}
            <section className="py-16 md:py-20">
                <div className="mx-auto max-w-6xl px-4 md:px-6 lg:px-8">
                    <h2 className="mb-10 text-3xl font-thin text-delft md:text-4xl">Formulare Downloads</h2>

                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {page.cards?.map((card, idx) => (
                            <DownloadCard key={card?._key || idx} card={card} />
                        ))}
                    </div>
                </div>
            </section>

            <AppointmentCTASection />
        </>
    );
}
