// components/sections/ServiceDetailHero.jsx
import Image from "next/image";
import { useState } from "react";
import { urlFor } from "@/function/urlFor";
import { H1 } from "@/typography/headlines";
import { hyphenateTitle } from "@/utils/hyphenateTitle";

export default function ServiceDetailHero({ title, subtitle, image }) {
    const hasImage = !!image;
    const imgUrl = hasImage
        ? urlFor(image.asset || image)
              .width(1600)
              .url()
        : null;

    const [loaded, setLoaded] = useState(false);
    const displayTitle = hyphenateTitle(title); // <- HIER

    const isDecorative = image?.isDecorative;
    const imgAlt = isDecorative ? "" : image?.alt || title || "Behandlung";
    const hasCaption = !!image?.caption;

    const headingId = "service-hero-heading";
    const descId = subtitle ? "service-hero-desc" : undefined;

    return (
        <section className="bg-primary-50 pt-12 pb-20" aria-labelledby={headingId} aria-describedby={descId}>
            <div
                className="
                    container mx-auto px-4 md:px-6 lg:px-10
                    flex flex-col-reverse md:flex-row
                    items-center gap-16
                "
            >
                {/* BILD */}
                {hasImage && imgUrl && (
                    <figure
                        className="
                            relative w-full md:w-7/12 lg:w-7/12
                            max-w-[1600px]
                            aspect-[5/4] md:aspect-[5/5]
                            mx-auto
                        "
                        aria-hidden={isDecorative ? true : undefined}
                        role={isDecorative ? "presentation" : undefined}
                    >
                        {/* Loader / Skeleton solange Bild nicht fertig */}
                        {!loaded && (
                            <div
                                className="
                                    absolute inset-0 
                                    animate-pulse rounded-xl
                                    bg-slate-200 
                                "
                            />
                        )}

                        <Image
                            src={imgUrl}
                            alt={imgAlt}
                            fill
                            priority
                            onLoad={() => setLoaded(true)}
                            className={`
                                object-contain object-center
                                transition-opacity duration-700
                                ${loaded ? "opacity-100" : "opacity-0"}
                            `}
                            sizes="(min-width: 1024px) 60vw, 100vw"
                        />

                        {hasCaption && !isDecorative && (
                            <figcaption className="mt-3 text-sm text-slate-600">{image.caption}</figcaption>
                        )}
                    </figure>
                )}

                {/* TEXT */}
                <div className="w-full md:w-5/12 lg:w-5/12">
                    {title && (
                        <H1
                            id={headingId}
                            className="
                                text-delft font-thin
                                text-3xl leading-snug
                                sm:text-4xl md:text-5xl lg:text-6xl
                            "
                        >
                            {displayTitle}
                        </H1>
                    )}

                    {subtitle && (
                        <p
                            id={descId}
                            className="
                                mt-6 font-body
                                text-base md:text-lg
                                leading-relaxed tracking-wide
                                text-delft
                                whitespace-pre-line
                            "
                        >
                            {subtitle}
                        </p>
                    )}
                </div>
            </div>
        </section>
    );
}
