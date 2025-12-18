// components/Seo.jsx
import Head from "next/head";

import DefaultImg from "@/assets/images/praxis1.jpg";

const DEFAULTS = {
    siteName: "Zentrum für Zahnmedizin | Dr. Köhnke & Kollegen",
    baseUrl: "https://www.zahnarztpraxis-hattersheim.de",
    title: "Zentrum für Zahnmedizin | Dr. Köhnke & Kollegen",
    description:
        "Moderne Zahnmedizin, persönliche Betreuung und einfühlsame Behandlung – für gesunde Zähne und ein strahlendes Lächeln, das bleibt.",
    image: DefaultImg.src, // absoluter oder relativer Pfad
};

export default function Seo({
    // Basis
    title,
    description,
    url,
    type = "website", // "website" | "article" etc.
    image,
    noIndex = false,

    // Optional
    siteName = DEFAULTS.siteName,
    twitterHandle = DEFAULTS.twitterHandle,
    schemaOrg, // optional: JSON-LD Objekt
}) {
    const metaTitle = title ? `${title} | ${siteName}` : `${DEFAULTS.title} | ${siteName}`;

    const metaDescription = description || DEFAULTS.description;
    const metaUrl = url || DEFAULTS.baseUrl;
    const metaImage = image || DEFAULTS.image;

    const robotsContent = noIndex ? "noindex,nofollow" : "index,follow";

    return (
        <Head>
            {/* Basis */}
            <title>{metaTitle}</title>
            <meta name="description" content={metaDescription} />
            <meta name="robots" content={robotsContent} />

            {/* Open Graph */}
            <meta property="og:type" content={type} />
            <meta property="og:title" content={metaTitle} />
            <meta property="og:description" content={metaDescription} />
            <meta property="og:url" content={metaUrl} />
            <meta property="og:site_name" content={siteName} />
            {metaImage && <meta property="og:image" content={metaImage} />}

            {/* Twitter Cards */}
            <meta name="twitter:card" content="summary_large_image" />
            {twitterHandle && <meta name="twitter:site" content={twitterHandle} />}
            <meta name="twitter:title" content={metaTitle} />
            <meta name="twitter:description" content={metaDescription} />
            {metaImage && <meta name="twitter:image" content={metaImage} />}

            {/* Canonical */}
            <link rel="canonical" href={metaUrl} />

            {/* Optionale strukturierte Daten */}
            {schemaOrg && (
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{
                        __html: JSON.stringify(schemaOrg),
                    }}
                />
            )}
        </Head>
    );
}
