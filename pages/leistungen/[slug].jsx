// pages/leistungen/[slug].jsx

import { sanityClient } from "@/client";
import { singleServiceQuery } from "@/libs/queries";

import DetailHero from "@/sections/heroDetail";
import TextImageSection from "@/sections/textImageFull";
import InfoBar from "@/sections/infoBar";

import LeistungenSection from "@/sections/leistungen";
import AppointmentCTASection from "@/sections/cta";

// SEO
import Seo from "@/components/seo"; // <- Achte auf Groß/Klein: du hast beides genutzt
import { seoFromSanity } from "@/libs/seoFromSanity";

export async function getStaticPaths() {
    const slugs = await sanityClient.fetch(`*[_type == "service" && defined(slug.current)].slug.current`);

    const paths = (slugs || []).map((slug) => ({
        params: { slug },
    }));

    return {
        paths,
        fallback: "blocking",
    };
}

export async function getStaticProps({ params }) {
    const data = await sanityClient.fetch(singleServiceQuery, {
        slug: params.slug,
    });

    if (!data?.service) return { notFound: true };

    const service = data.service;

    // Wichtig: baseUrl konsistent zur Domain, die du wirklich indexieren willst.
    const baseUrl = "https://www.zahnarztpraxis-hattersheim.de";

    // seoFromSanity soll idealerweise:
    // - metaTitle / metaDescription aus service.seo ziehen
    // - Canonical auf `${baseUrl}/leistungen/${service.slug}` setzen
    // - OG Image aus service.seo.ogImage und/oder service.heroImage ableiten
    const seo = seoFromSanity(service, {
        baseUrl,
        basePath: "leistungen", // => /leistungen/<slug>
        siteName: "Zentrum für Zahnmedizin | Dr. Köhnke & Kollegen",
        // Optional (falls dein Helper das unterstützt):
        // fallbackTitle: service.title,
        // fallbackDescription: service.teaser,
    });

    return {
        props: {
            service,
            services: data.services || [],
            seo,
        },
        revalidate: 60,
    };
}

export default function ServicePage({ service, services, seo }) {
    const heroImage = service?.heroImage || service?.seo?.ogImage || null;

    return (
        <>
            <Seo {...seo} />

            <DetailHero
                key={service.slug} // remount bei Slug-Wechsel
                title={service.title}
                subtitle={service.teaser}
                image={heroImage}
            />

            <InfoBar />

            {service?.introSection && (
                <TextImageSection
                    key={`intro-${service.slug}`}
                    noCenter
                    section={service.introSection}
                    id="service-intro"
                    whiteBG
                />
            )}

            <LeistungenSection services={services} currentSlug={service.slug} headline="Weitere Leistungen" />

            <AppointmentCTASection />
        </>
    );
}
