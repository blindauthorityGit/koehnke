// components/buttons/PrimaryButton.jsx
import React from "react";
import clsx from "clsx";

export default function PrimaryButton({
    children,
    onClick,
    icon = null,
    variant = "mint", // mint | white | delft | compact
    className = "",
    ...props
}) {
    const variants = {
        mint: "bg-mint text-white hover:bg-mint-500",
        white: "bg-white text-delft-900 border border-delft-900 hover:bg-delft-900 hover:text-white",
        delft: "bg-delft-900 text-white hover:bg-delft-800",

        // 🔥 Mobile kompakt
        compact: "bg-delft-900 text-white px-5 py-2 text-sm font-semibold rounded-xl hover:bg-delft-800",
    };

    return (
        <button
            {...props}
            onClick={onClick}
            className={clsx(
                "inline-flex items-center gap-2 rounded-xl",
                "px-6 py-3 text-sm md:px-8 md:py-4 md:text-base lg:px-12 lg:py-4 2xl:px-16 2xl:py-6",
                "w-full lg:w-auto justify-center",
                "font-medium tracking-wide transition-colors font-body",
                variant === "compact" && "!px-5 !py-2 !text-xs !rounded-xl gap-1 !w-auto",
                variants[variant],
                className
            )}
        >
            {icon && <span className={clsx("text-lg", variant === "compact" && "text-base")}>{icon}</span>}
            <span>{children}</span>
        </button>
    );
}
