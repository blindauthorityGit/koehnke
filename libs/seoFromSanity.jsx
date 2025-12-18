// lib/seoFromSanity.js
import { urlFor } from "@/function/urlFor";

/**
 * Mappt ein Sanity-Dokument (z.B. service / page)
 * auf Props für die <Seo>-Komponente.
 */
export function seoFromSanity(doc, options = {}) {
    if (!doc) return {};

    const {
        baseUrl = "https://www.deine-domain.tld",
        defaultImage = "/default-og.jpg",
        siteName,
        basePath = "", // z.B. "leistungen" oder "blog"
    } = options;

    const seo = doc.seo || {};

    // ---- Titel & Description ----
    const title = seo.metaTitle?.trim() || doc.title?.trim() || ""; // <Seo> setzt dann seinen eigenen Default

    const description = seo.metaDescription?.trim() || doc.teaser?.trim() || "";

    // ---- Bild-Priorität: seo.ogImage -> heroImage -> defaultImage ----
    const imageSource = seo.ogImage || doc.heroImage || null;

    const imageUrl = imageSource ? urlFor(imageSource).width(1200).height(630).fit("crop").url() : defaultImage;

    // ---- URL bauen (slug ist String, nicht slug.current) ----
    const slugValue = typeof doc.slug === "string" ? doc.slug : doc.slug?.current;

    const cleanBaseUrl = baseUrl.replace(/\/$/, "");
    const cleanBasePath = basePath ? basePath.replace(/^\/|\/$/g, "") : "";

    let path = "";
    if (cleanBasePath && slugValue) {
        path = `/${cleanBasePath}/${slugValue}`;
    } else if (cleanBasePath && !slugValue) {
        path = `/${cleanBasePath}`;
    } else if (!cleanBasePath && slugValue) {
        path = `/${slugValue}`;
    } else {
        path = "/";
    }

    const url = `${cleanBaseUrl}${path}`;

    return {
        title,
        description,
        image: imageUrl,
        url,
        type: "website", // kannst du bei Bedarf pro Doku überschreiben
        noIndex: !!seo.noIndex,
        siteName,
    };
}
