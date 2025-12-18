// pages/leistungen/[slug].jsx

import Head from "next/head";

import { sanityClient } from "@/client";
import { singleServiceQuery } from "@/libs/queries";

import DetailHero from "@/sections/heroDetail";
import TextImageSection from "@/sections/textImageFull";
import InfoBar from "@/sections/infoBar";

// WICHTIG: Neuer korrekter Import der LeistungenSection
import LeistungenSection from "@/sections/leistungen";
import AppointmentCTASection from "@/sections/cta";

// NEU:
import Seo from "@/components/seo";
import { seoFromSanity } from "@/libs/seoFromSanity";

export async function getStaticPaths() {
    // Alle Slugs für Services vorab holen
    const slugs = await sanityClient.fetch(`*[_type == "service" && defined(slug.current)].slug.current`);

    const paths = slugs.map((slug) => ({
        params: { slug },
    }));

    return {
        paths,
        fallback: "blocking", // neue Leistungen werden on demand generiert
    };
}

export async function getStaticProps({ params }) {
    const data = await sanityClient.fetch(singleServiceQuery, {
        slug: params.slug,
    });

    if (!data?.service) {
        return { notFound: true };
    }

    const seo = seoFromSanity(data.service, {
        baseUrl: "https://www.zahnarzt-koehnke.de",
        basePath: "leistungen", // ergibt /leistungen/slug
        siteName: "Zahnarztpraxis Köhnke",
    });

    return {
        props: {
            service: data.service,
            services: data.services || [],
            seo,
        },
        revalidate: 60,
    };
}

export default function ServicePage({ service, services, seo }) {
    const heroImage = service.heroImage || service.seo?.ogImage || null;

    const pageTitle = service.seo?.metaTitle || `${service.title} – Dr. Köhnke & Kollegen`;
    const metaDescription = service.seo?.metaDescription || service.teaser || "";

    console.log(service, services);

    return (
        <>
            {/* SEO / Head */}
            <Seo {...seo} />

            {/* HERO */}
            <DetailHero
                key={service.slug} // WICHTIG: remount bei neuem Slug
                title={service.title}
                subtitle={service.teaser}
                image={heroImage}
            />

            <InfoBar />

            {/* INTRO SECTION ALS TEXT/BILD */}
            {service.introSection && (
                <TextImageSection
                    key={`intro-${service.slug}`} // 👈 remount bei Routewechsel
                    noCenter
                    section={service.introSection}
                    id="service-intro"
                    whiteBG
                />
            )}

            {/* Leistungen-Übersicht aus Sanity */}
            <LeistungenSection services={services} currentSlug={service.slug} headline="Weitere Leistungen" />
            <AppointmentCTASection />
        </>
    );
}
