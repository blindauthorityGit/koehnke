// helpers/seoMap.js (oder direkt in pages/index.js)
import { urlFor } from "@/function/urlFor"; // ggf. Pfad anpassen

export function mapSanitySeoToSeoProps({ seo, fallbackTitle, fallbackDescription, fallbackUrl }) {
    const metaTitle = seo?.metaTitle?.trim() || fallbackTitle || undefined;

    const metaDescription = seo?.metaDescription?.trim() || fallbackDescription || undefined;

    const noIndex = Boolean(seo?.noIndex);

    // ogImage kann bei dir ein Sanity-Image-Objekt sein (screenshot: ogImage: [Object])
    const ogImage = seo?.ogImage || seo?.openGraphImage || seo?.image || null;

    // OG Image: immer absolute URL, ideal 1200x630
    const imageUrl = ogImage
        ? urlFor(ogImage?.asset ? ogImage : ogImage?.asset || ogImage)
              .width(1200)
              .height(630)
              .fit("crop")
              .url()
        : undefined;

    return {
        title: metaTitle,
        description: metaDescription,
        url: fallbackUrl,
        noIndex,
        image: imageUrl,
        type: "website",
    };
}
