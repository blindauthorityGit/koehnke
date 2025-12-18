import Link from "next/link";
import Image from "next/image";

import { urlFor } from "@/function/urlFor";

export default function JobCard({ job }) {
    if (!job) return null;

    const { title, teaser, slug, image } = job;

    // Slug kann bei dir bereits string sein (wie im Screenshot),
    // oder mal als { current } kommen – beides abfangen.
    const slugValue = typeof slug === "string" ? slug : slug?.current;
    const href = slugValue ? `/karriere/${slugValue}` : "/karriere";

    const imgUrl = image
        ? urlFor(image.asset || image)
              .width(900)
              .height(620)
              .url()
        : null;
    const isDecorative = image?.isDecorative;
    const imgAlt = isDecorative ? "" : image?.alt || title || "Offene Stelle";

    return (
        <article className="overflow-hidden rounded-3xl bg-white shadow-[0_18px_60px_rgba(15,23,42,0.08)] ring-1 ring-slate-900/5">
            {/* Bild + Link (vollflächig klickbar) */}
            <Link href={href} className="block group">
                <div className="relative aspect-[16/10] w-full overflow-hidden">
                    {imgUrl ? (
                        <Image
                            src={imgUrl}
                            alt={imgAlt}
                            fill
                            sizes="(min-width: 1024px) 33vw, 100vw"
                            className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                            {...(isDecorative ? { role: "presentation", "aria-hidden": true } : {})}
                        />
                    ) : (
                        <div className="h-full w-full bg-primary-50" />
                    )}
                </div>
            </Link>

            {/* Content */}
            <div className="px-7 pb-7 pt-6">
                <h3 className="text-[18px] font-semibold leading-snug text-delft">
                    <Link href={href} className="hover:underline hover:underline-offset-4">
                        {title}
                    </Link>
                </h3>

                {teaser && <p className="mt-3 text-[14px] leading-relaxed tracking-wide text-delft/80">{teaser}</p>}

                {/* Button */}
                <div className="mt-6">
                    <Link
                        href={href}
                        className="
                            inline-flex w-full items-center justify-center
                            rounded-full border border-primary-500 bg-white
                            px-5 py-3 text-sm font-medium text-primary-700
                            transition hover:bg-primary-50
                            focus-visible:outline-none focus-visible:ring-2
                            focus-visible:ring-primary-500 focus-visible:ring-offset-2
                        "
                        aria-label={title ? `Mehr erfahren: ${title}` : "Mehr erfahren"}
                    >
                        Mehr erfahren
                    </Link>
                </div>
            </div>
        </article>
    );
}
