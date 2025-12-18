import Image from "next/image";
import Link from "next/link";
import { urlFor } from "@/function/urlFor";
import { resolveCtaButton } from "@/libs/resolveCtaButton";

export default function DownloadCard({ card }) {
    if (!card) return null;

    const { title, description, image, buttons = [] } = card;

    const imageUrl = image
        ? urlFor(image.asset || image)
              .width(900)
              .height(520)
              .fit("crop")
              .url()
        : null;

    const isDecorative = image?.isDecorative;
    const imageAlt = isDecorative ? "" : image?.alt || title || "";

    const resolvedButtons = (buttons || []).map(resolveCtaButton).filter(Boolean);

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

            {resolvedButtons.length > 0 && (
                <div className="mt-6 space-y-3">
                    {resolvedButtons.map((btn) =>
                        btn.isInternal ? (
                            <Link key={btn.key} href={btn.href} className={btn.classes} aria-label={btn.ariaLabel}>
                                {btn.label}
                            </Link>
                        ) : (
                            <a
                                key={btn.key}
                                href={btn.href}
                                target={btn.opensInNewTab ? "_blank" : undefined}
                                rel={btn.opensInNewTab ? "noopener noreferrer" : undefined}
                                download={btn.download ? "" : undefined}
                                className={btn.classes}
                                aria-label={btn.ariaLabel}
                            >
                                {btn.label}
                            </a>
                        )
                    )}
                </div>
            )}
        </article>
    );
}
