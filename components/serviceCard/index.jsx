// components/services/ServiceCard.jsx
import Image from "next/image";
import Link from "next/link";
import { urlFor } from "@/function/urlFor";
import { resolveLinkToHref } from "@/libs/resolveLink";

export default function ServiceCard({ card }) {
    const imgUrl = card?.image ? urlFor(card.image).width(1000).height(700).url() : null;

    const alt = card?.image?.isDecorative ? "" : card?.image?.alt || card?.title || "Service";

    const href = resolveLinkToHref(card?.buttonLink);
    const newTab = card?.buttonLink?.newTab;

    return (
        <div className="rounded-2xl bg-white p-5 md:p-6 shadow-[0_12px_40px_rgba(15,23,42,0.06)]">
            {/* Bild */}
            <div className="relative overflow-hidden rounded-xl bg-primary-50">
                {imgUrl ? (
                    <Image
                        src={imgUrl}
                        alt={alt}
                        width={1000}
                        height={650}
                        className="h-44 w-full object-cover sm:h-48 md:h-52"
                        priority={false}
                    />
                ) : (
                    <div className="h-44 w-full sm:h-48 md:h-52" />
                )}
            </div>

            {/* Text */}
            <div className="mt-5 space-y-3">
                <p className="text-base md:text-lg font-semibold text-primary-900">{card?.title}</p>

                {card?.description ? (
                    <p className="text-sm md:text-[15px] leading-relaxed text-primary-800/75">{card.description}</p>
                ) : null}

                {/* Button */}
                <div className="pt-3">
                    <Link
                        href={href}
                        target={newTab ? "_blank" : undefined}
                        rel={newTab ? "noopener noreferrer" : undefined}
                        className="
              inline-flex w-full items-center justify-center
              rounded-xl border border-primary-900/25
              px-4 py-3 text-sm font-medium
              text-primary-900
              hover:border-primary-900/40 hover:bg-primary-50
              transition
            "
                    >
                        {card?.buttonText || "Mehr erfahren"}
                    </Link>
                </div>
            </div>
        </div>
    );
}
