export function resolveCtaButton(btn) {
    if (!btn?.label) return null;

    let href = "#";
    let isInternal = false;

    if (btn.linkType === "external") {
        href = btn.externalUrl;
    }

    if (btn.linkType === "internal") {
        if (btn.internalTargetType === "path") {
            href = btn.internalPath;
            isInternal = true;
        } else if (btn.internalLink?.slug?.current) {
            href = `/${btn.internalLink.slug.current}`;
            isInternal = true;
        }
    }

    if (btn.linkType === "file") {
        href = btn.file?.file?.asset?.url || btn.file?.asset?.url;
    }

    if (!href || href === "#") return null;

    let classes = "inline-flex w-full items-center justify-center rounded-xl px-4 py-3 text-sm font-medium transition";

    if (btn.variant === "secondary") {
        classes += " border border-primary-900/25 text-primary-900 hover:bg-primary-50";
    } else if (btn.variant === "text") {
        classes += " text-primary-900 underline underline-offset-4";
    } else {
        classes += " bg-primary-900 text-white hover:bg-primary-800";
    }

    return {
        label: btn.label,
        href,
        isInternal,
        opensInNewTab: btn.opensInNewTab,
        ariaLabel: btn.ariaLabel || btn.label,
        classes,
    };
}
