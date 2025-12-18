// components/buttons/StandardButton.jsx
import React from "react";
import clsx from "clsx";

export default function BasicButton({ children, icon = null, className = "", ...props }) {
    return (
        <button
            {...props}
            className={clsx(
                "inline-flex items-center gap-2 rounded-xl border border-delft-900",
                // new responsive paddings:
                "px-6 py-3 text-sm md:px-8 md:py-4 w-full lg:w-auto justify-center md:text-base lg:px-12 lg:py-4 2xl:px-16 2xl:py-6",
                "font-regular tracking-wider",
                "text-delft-900 bg-transparent",
                "transition-colors hover:bg-delft-900 hover:text-white",
                className
            )}
        >
            {icon && <span className="text-lg">{icon}</span>}
            <span>{children}</span>
        </button>
    );
}
