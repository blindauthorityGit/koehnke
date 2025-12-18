// components/services/ServiceCard.jsx
import Image from "next/image";
import Link from "next/link";
import { urlFor } from "@/function/urlFor";
import { resolveCtaButton } from "@/libs/resolveCtaButton";

export default function ServiceCard({ card }) {
    if (!card) return null;

    const imgUrl = card.image ? urlFor(card.image).width(1000).height(700).fit("crop").url() : null;

    const alt = card?.image?.isDecorative ? "" : card?.image?.alt || card?.title || "Service";

    const btn = resolveCtaButton(card.button);
    if (!btn) return null;

    const ImageLinkWrapper = btn.isInternal ? Link : "a";
    const imageLinkProps = btn.isInternal
        ? { href: btn.href }
        : {
              href: btn.href,
              target: btn.opensInNewTab ? "_blank" : undefined,
              rel: btn.opensInNewTab ? "noopener noreferrer" : undefined,
          };

    return (
        <div
            className="
                group
                rounded-2xl bg-white p-5 md:p-6
                shadow-[0_12px_40px_rgba(15,23,42,0.06)]
                transition
            "
        >
            {/* Bild – klickbar */}
            <ImageLinkWrapper {...imageLinkProps} aria-label={btn.ariaLabel} className="block">
                <div className="relative overflow-hidden rounded-xl bg-primary-50">
                    {imgUrl ? (
                        <>
                            <Image
                                src={imgUrl}
                                alt={alt}
                                width={1000}
                                height={650}
                                className="
                                    h-44 w-full object-cover
                                    sm:h-48 md:h-52
                                    transition-transform duration-500 ease-out
                                    group-hover:scale-[1.04]
                                "
                            />

                            {/* dezenter Overlay-Fade */}
                            <div
                                className="
                                    pointer-events-none
                                    absolute inset-0
                                    bg-black/0
                                    transition-colors duration-300
                                    group-hover:bg-black/10
                                "
                            />
                        </>
                    ) : (
                        <div className="h-44 w-full sm:h-48 md:h-52" />
                    )}
                </div>
            </ImageLinkWrapper>

            {/* Text */}
            <div className="mt-5 space-y-3">
                <p className="text-base md:text-lg font-semibold text-primary-900">{card.title}</p>

                {card.description && (
                    <p className="text-sm md:text-[15px] leading-relaxed text-primary-800/75">{card.description}</p>
                )}

                {/* Button */}
                <div className="pt-3">
                    {btn.isInternal ? (
                        <Link href={btn.href} className={btn.classes} aria-label={btn.ariaLabel}>
                            {btn.label}
                        </Link>
                    ) : (
                        <a
                            href={btn.href}
                            target={btn.opensInNewTab ? "_blank" : undefined}
                            rel={btn.opensInNewTab ? "noopener noreferrer" : undefined}
                            className={btn.classes}
                            aria-label={btn.ariaLabel}
                        >
                            {btn.label}
                        </a>
                    )}
                </div>
            </div>
        </div>
    );
}
