// pages/praxis.js
import Head from "next/head";
import Image from "next/image";

import { sanityClient } from "@/client";
import { praxisPageQuery } from "@/libs/queries";

import PageHero from "@/sections/heroPages";
import InfoBar from "@/sections/infoBar";
import TextImageSectionFull from "@/sections/textImageFull";
import AppointmentCTASection from "@/sections/cta";

import { urlFor } from "@/function/urlFor";

export async function getStaticProps() {
    const data = await sanityClient.fetch(praxisPageQuery);

    return {
        props: { data },
        revalidate: 60,
    };
}

function PraxisGallery({ images = [] }) {
    if (!images || images.length < 3) return null;

    const [left, topRight, bottomRight] = images;

    return (
        <section className="py-20">
            <div className="mx-auto max-w-6xl px-4 md:px-6 lg:px-8">
                <div
                    className="
                        grid grid-cols-1 gap-6
                        md:grid-cols-2
                    "
                >
                    {/* LEFT – Portrait / Tall */}
                    <div className="relative overflow-hidden rounded-2xl">
                        <img
                            src={left?.asset?.url}
                            alt={left?.isDecorative ? "" : left?.alt || "Praxis"}
                            className="
                                h-full w-full
                                object-cover
                                min-h-[420px] md:min-h-[560px]
                            "
                        />
                    </div>

                    {/* RIGHT – two stacked landscapes */}
                    <div
                        className="
                            grid gap-6
                            grid-rows-[1.1fr_0.9fr]
                        "
                    >
                        <div className="relative overflow-hidden rounded-2xl">
                            <img
                                src={topRight?.asset?.url}
                                alt={topRight?.isDecorative ? "" : topRight?.alt || "Praxis"}
                                className="
                                    h-full w-full
                                    object-cover
                                    min-h-[260px]
                                "
                            />
                        </div>

                        <div className="relative overflow-hidden rounded-2xl">
                            <img
                                src={bottomRight?.asset?.url}
                                alt={bottomRight?.isDecorative ? "" : bottomRight?.alt || "Praxis"}
                                className="
                                    h-full w-full
                                    object-cover
                                    min-h-[220px]
                                "
                            />
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

export default function PraxisPage({ data }) {
    const page = data?.page;

    if (!page) return null;

    const heroImage = page.heroImage || page.seo?.ogImage;

    const title = page?.seo?.title || page.heroTitle || "Praxis";
    const description = page?.seo?.description || page.heroSubtitle || "";

    return (
        <>
            <Head>
                <title>{title}</title>
                {description ? <meta name="description" content={description} /> : null}
                {/* Optional: OG Basics, falls dein SEO-Objekt nicht sowieso zentral gerendert wird */}
            </Head>

            <PageHero title={page.heroTitle} subtitle={page.heroSubtitle} image={heroImage} />
            <InfoBar />

            <PraxisGallery images={page.gallery} />

            {page.imgTextSection ? (
                <TextImageSectionFull section={page.imgTextSection} id="praxis-imgtext" whiteBG />
            ) : null}

            <AppointmentCTASection />
        </>
    );
}
