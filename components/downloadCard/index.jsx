// components/downloads/DownloadCard.jsx
import Image from "next/image";
import Link from "next/link";
import { urlFor } from "@/function/urlFor";

export default function DownloadCard({ card }) {
    if (!card) return null;

    const { title, description, image, buttons = [] } = card;

    const imageUrl = image
        ? urlFor(image.asset || image)
              .width(900)
              .height(520)
              .url()
        : null;

    const isDecorative = image?.isDecorative;
    const imageAlt = isDecorative ? "" : image?.alt || title || "";

    const preparedButtons = (buttons || [])
        .map((btn) => {
            const {
                label,
                variant = "secondary",
                linkType = "internal",
                internalLink,
                externalUrl,
                ariaLabel,
                opensInNewTab,
            } = btn || {};

            if (!label) return null;

            let href = "#";

            if (linkType === "external" && externalUrl) {
                href = externalUrl;
            } else if (linkType === "internal" && internalLink?.slug) {
                href = `/${internalLink.slug}`;
            } else if (linkType === "internal" && internalLink?._type === "servicesPage") {
                href = "/leistungen";
            }

            if (!href || href === "#") return null;

            const commonProps = { href, "aria-label": ariaLabel || label };

            if (opensInNewTab) {
                commonProps.target = "_blank";
                commonProps.rel = "noopener noreferrer";
            }

            let base =
                "inline-flex w-full items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-medium " +
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-primary-500 transition";

            if (variant === "primary") {
                base += " bg-primary-700 text-white hover:bg-primary-800";
            } else if (variant === "text") {
                base += " bg-transparent text-primary-700 underline underline-offset-4 hover:text-primary-900";
            } else {
                base += " border border-primary-500 text-primary-700 bg-white hover:bg-primary-50";
            }

            return { key: btn?._key || label + href, commonProps, label, classes: base };
        })
        .filter(Boolean);

    return (
        <article className="rounded-3xl bg-white p-5 shadow-[0_18px_60px_rgba(15,23,42,0.06)]">
            {imageUrl && (
                <div className="relative mb-5 aspect-[16/10] w-full overflow-hidden rounded-2xl bg-slate-100">
                    <Image
                        src={imageUrl}
                        alt={imageAlt}
                        fill
                        sizes="(min-width: 1024px) 360px, 90vw"
                        className="object-cover"
                        {...(isDecorative ? { role: "presentation", "aria-hidden": true } : {})}
                    />
                </div>
            )}

            {title && <h3 className="text-lg font-semibold text-primary-900">{title}</h3>}

            {description && <p className="mt-3 text-sm leading-relaxed tracking-wide text-delft/80">{description}</p>}

            {preparedButtons.length > 0 && (
                <div className="mt-6 space-y-3">
                    {preparedButtons.map((b) => (
                        <Link key={b.key} {...b.commonProps} className={b.classes}>
                            {b.label}
                        </Link>
                    ))}
                </div>
            )}
        </article>
    );
}
