import Image from "next/image";
import Link from "next/link";
import { H1 } from "@/typography/headlines";
import { BasicButton, PrimaryButton } from "@/components/buttons";
import { BsCalendar } from "react-icons/bs";
import { urlFor } from "@/function/urlFor";

/**
 * Einmalige Zuordnung für Singletons ohne slug/title.
 * Vorteil: kein Hardcoding in 10 Komponenten – nur hier zentral.
 */
const SINGLETON_ROUTES_BY_ID = {
    startPage: "/",
    servicesPage: "/leistungen",
    // settings: "/settings" // normalerweise nicht öffentlich
    // teamSection: "/team"  // wenn du sowas hast
};

function slugifyFromTitle(title = "") {
    return title
        .toLowerCase()
        .trim()
        .replace(/ä/g, "ae")
        .replace(/ö/g, "oe")
        .replace(/ü/g, "ue")
        .replace(/ß/g, "ss")
        .replace(/[^a-z0-9]+/g, "_")
        .replace(/_+/g, "_")
        .replace(/^_|_$/g, "");
}

function resolveInternalHref(internalLink) {
    if (!internalLink) return null;

    // 1) "normale" Seiten/Docs mit slug
    if (internalLink.slug) return `/${internalLink.slug}`;

    // 2) Fallback via title (falls vorhanden)
    if (internalLink.title) return `/${slugifyFromTitle(internalLink.title)}`;

    // 3) Singletons ohne slug/title -> Route via documentId
    if (internalLink._id && SINGLETON_ROUTES_BY_ID[internalLink._id]) {
        return SINGLETON_ROUTES_BY_ID[internalLink._id];
    }

    // 4) Optional: generischer Fallback (nicht empfohlen, aber möglich)
    // if (internalLink._type) return `/${internalLink._type}`;

    return null;
}

export default function Hero({ data }) {
    if (!data) return null;

    const { heroTitle, heroSubtitle, heroButtons = [], heroImage } = data;

    const imageUrl = heroImage ? urlFor(heroImage).url() : null;
    const imageAlt = heroImage?.isDecorative ? "" : heroImage?.alt || heroTitle || "";

    const renderButton = (btn) => {
        const {
            _key,
            label,
            variant = "primary",
            linkType = "internal",
            internalLink,
            externalUrl,
            ariaLabel,
            opensInNewTab,
        } = btn || {};

        if (!label) return null;

        let href = null;

        if (linkType === "external") {
            href = externalUrl || null;
        } else {
            href = resolveInternalHref(internalLink);
        }

        if (!href) return null;

        const ButtonComponent = variant === "primary" ? PrimaryButton : BasicButton;

        const buttonProps = {
            icon: <BsCalendar />,
            variant: variant === "primary" ? "mint" : undefined,
            "aria-label": ariaLabel || label,
        };

        // EXTERNAL
        if (linkType === "external") {
            return (
                <a
                    key={_key || label + href}
                    href={href}
                    target={opensInNewTab ? "_blank" : undefined}
                    rel={opensInNewTab ? "noopener noreferrer" : undefined}
                >
                    <ButtonComponent {...buttonProps}>{label}</ButtonComponent>
                </a>
            );
        }

        // INTERNAL
        return (
            <Link key={_key || label + href} href={href}>
                <ButtonComponent {...buttonProps}>{label}</ButtonComponent>
            </Link>
        );
    };

    return (
        <section
            className="
        relative overflow-hidden bg-primary-50
        pt-10 pb-16 md:pb-32 lg:pt-24 lg:h-[720px] 2xl:h-[860px]
        h-[calc(100svh-120px)] md:min-h-0
      "
        >
            {/* MOBILE BG IMAGE */}
            {imageUrl && (
                <div className="absolute inset-0 md:hidden">
                    <Image
                        src={imageUrl}
                        alt={imageAlt}
                        fill
                        priority
                        className="object-cover object-right !left-[20%]"
                        {...(heroImage?.isDecorative ? { role: "presentation", "aria-hidden": true } : {})}
                    />
                </div>
            )}

            {/* DESKTOP BG IMAGE */}
            {imageUrl && (
                <div className="hidden md:block absolute inset-y-0 right-0 w-[58%] max-w-[980px]">
                    <Image
                        src={imageUrl}
                        alt={imageAlt}
                        fill
                        priority
                        className="object-contain object-right"
                        {...(heroImage?.isDecorative ? { role: "presentation", "aria-hidden": true } : {})}
                    />
                </div>
            )}

            {/* CONTENT */}
            <div className="container relative z-10 mx-auto h-full">
                {/* MOBILE */}
                <div className="md:hidden flex h-full">
                    <div className="flex flex-col justify-end w-full max-w-sm mt-24 mb-2">
                        {heroSubtitle && (
                            <p className="text-base font-body mb-4 leading-relaxed tracking-wide text-delft">
                                {heroSubtitle}
                            </p>
                        )}

                        <H1 className="mt-3 text-delft font-thin text-3xl leading-snug">{heroTitle}</H1>

                        {heroButtons.length > 0 && (
                            <div className="mt-10 flex flex-col gap-3">
                                {heroButtons.map(renderButton).filter(Boolean)}
                            </div>
                        )}
                    </div>
                </div>

                {/* DESKTOP */}
                <div className="hidden md:block max-w-xl lg:max-w-2xl pt-14">
                    <H1
                        className="
              text-delft font-thin
              text-4xl leading-tight
              sm:text-5xl
              md:text-6xl
              lg:text-7xl
            "
                    >
                        {heroTitle}
                    </H1>

                    {heroSubtitle && (
                        <p className="mt-6 font-body max-w-md text-base 2xl:text-lg leading-relaxed text-delft tracking-wide">
                            {heroSubtitle}
                        </p>
                    )}

                    {heroButtons.length > 0 && (
                        <div className="mt-16 flex flex-col sm:flex-row gap-4">
                            {heroButtons.map(renderButton).filter(Boolean)}
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
}
