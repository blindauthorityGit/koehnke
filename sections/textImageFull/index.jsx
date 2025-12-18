// components/sections/TextImageSection.jsx
import Image from "next/image";
import Link from "next/link";
import { PortableText } from "@portabletext/react";

import { H2 } from "@/typography/headlines";
import { urlFor } from "@/function/urlFor";
import WaveSection from "@/components/layout/waveSections";

export default function TextImageSection({
    section,
    id,
    className = "",
    withWave = false,
    waveProps = {},
    whiteBG = false, // << NEU
}) {
    if (!section) return null;

    const { layout = "imageLeft", title, body, image, buttons = [] } = section;

    const isImageRight = layout === "imageRight";
    const headingId = id || section._key || undefined;

    // Bild-URL
    const imageUrl = image
        ? urlFor(image.asset || image)
              .width(1200)
              .url()
        : null;

    // Barrierefreiheit
    const isDecorative = image?.isDecorative;
    const imageAlt = isDecorative ? "" : image?.alt || title || "";

    // Buttons – gleich wie bisher
    const preparedButtons = (buttons || [])
        .map((btn) => {
            const {
                label,
                variant = "primary",
                linkType = "internal",

                internalTargetType = "reference", // << NEU
                internalPath, // << NEU

                internalLink,
                externalUrl,

                file,
                forceDownload,

                ariaLabel,
                opensInNewTab,
            } = btn || {};

            if (!label) return null;

            let href = "#";
            let isInternal = false;
            let isDownload = false;

            if (linkType === "external" && externalUrl) {
                href = externalUrl;
            } else if (linkType === "internal") {
                // ✅ NEU: fester Pfad
                if (internalTargetType === "path" && internalPath) {
                    href = internalPath;
                    isInternal = true;
                } else {
                    // ✅ Sanity-Referenz (wie bisher)
                    if (internalLink?._type === "servicesPage") {
                        href = "/leistungen";
                        isInternal = true;
                    } else if (internalLink?.slug?.current) {
                        href = `/${internalLink.slug.current}`;
                        isInternal = true;
                    } else if (internalLink?.slug) {
                        href = `/${internalLink.slug}`;
                        isInternal = true;
                    }
                }
            } else if (linkType === "file") {
                const fileUrl = file?.file?.asset?.url || file?.asset?.url;
                if (fileUrl) {
                    href = fileUrl;
                    isDownload = !!forceDownload;
                }
            }

            if (!href || href === "#") return null;

            const commonProps = {
                href,
                "aria-label": ariaLabel || label,
            };

            if (opensInNewTab) {
                commonProps.target = "_blank";
                commonProps.rel = "noopener noreferrer";
            }

            if (linkType === "file" && isDownload) {
                commonProps.download = "";
            }

            // ... classes etc unverändert

            let baseClasses =
                "inline-flex items-center justify-center rounded-full px-5 py-2 text-sm font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-primary-500 transition";

            if (variant === "secondary") {
                baseClasses += " border border-primary-500 text-primary-700 bg-white hover:bg-primary-50";
            } else if (variant === "text") {
                baseClasses +=
                    " text-primary-700 underline underline-offset-4 hover:text-primary-900 bg-transparent px-0";
            } else {
                baseClasses += " bg-primary-700 text-white hover:bg-primary-800";
            }

            return {
                key: label + href,
                commonProps,
                label,
                classes: baseClasses,
                isInternal, // << NEU
            };
        })
        .filter(Boolean);

    // --- Inhalt als eigenständige Section ---
    const sectionContent = (
        <section className={`w-full py-16 md:py-24 ${className}`} aria-labelledby={headingId}>
            <div
                className={`
                    container mx-auto flex flex-col gap-10 px-4 sm:px-6 lg:px-8
                    ${imageUrl ? "lg:grid lg:grid-cols-2 lg:items-center lg:gap-16" : ""}
                `}
            >
                {/* IMAGE */}
                {imageUrl && (
                    <div
                        className={`
                            relative h-[260px] overflow-hidden rounded-3xl
                            sm:h-[320px] md:h-[380px] lg:h-[420px] lg:rounded-[48px]
                            ${isImageRight ? "lg:order-2" : ""}
                        `}
                    >
                        <Image
                            src={imageUrl}
                            alt={imageAlt}
                            fill
                            sizes="(min-width: 1024px) 50vw, 100vw"
                            className="object-cover"
                            priority={false}
                            {...(isDecorative ? { role: "presentation", "aria-hidden": true } : {})}
                        />

                        {image?.caption && (
                            <p className="absolute inset-x-4 bottom-4 rounded-xl bg-black/55 px-3 py-1 text-xs text-white backdrop-blur-sm">
                                {image.caption}
                            </p>
                        )}
                    </div>
                )}

                {/* TEXT */}
                <div className={imageUrl && isImageRight ? "lg:order-1" : ""}>
                    {title && (
                        <H2
                            id={headingId}
                            className="mb-6 text-3xl font-semibold leading-snug text-slate-900 sm:text-4xl md:text-[2.5rem]"
                        >
                            {title}
                        </H2>
                    )}

                    {body && body.length > 0 && (
                        <div className="prose tracking-wider prose-slate text-delft max-w-none text-base leading-relaxed md:text-[1.05rem]">
                            <PortableText value={body} />
                        </div>
                    )}

                    {/* BUTTONS */}
                    {preparedButtons.length > 0 && (
                        <div className="mt-8 flex flex-wrap gap-3">
                            {preparedButtons.map((btn) =>
                                btn.isInternal ? (
                                    <Link
                                        key={btn.key}
                                        href={btn.commonProps.href}
                                        className={btn.classes}
                                        aria-label={btn.commonProps["aria-label"]}
                                    >
                                        {btn.label}
                                    </Link>
                                ) : (
                                    <a key={btn.key} {...btn.commonProps} className={btn.classes}>
                                        {btn.label}
                                    </a>
                                )
                            )}
                        </div>
                    )}
                </div>
            </div>
        </section>
    );

    // --- White BG Wrapper ---
    const wrappedWithWhiteBG = whiteBG ? (
        <div className="bg-white py-12 md:py-20">{sectionContent}</div>
    ) : (
        sectionContent
    );

    // --- Wave Wrapper ---
    if (withWave) {
        return (
            <WaveSection id={waveProps.id || headingId} {...waveProps}>
                {wrappedWithWhiteBG}
            </WaveSection>
        );
    }

    return wrappedWithWhiteBG;
}
