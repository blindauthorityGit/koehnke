// components/leistungen/LeistungCard.jsx

import Link from "next/link";
import { motion } from "framer-motion";
import { H3 } from "@/typography/headlines";

const CI_LIGHT_BLUE = "#E2EDF9";
const CI_ICON_BG_HOVER = "#A8CCED";

const cardVariants = {
    rest: {
        y: 0,
        backgroundColor: "rgba(255,255,255,0.9)",
        boxShadow: "0 18px 40px rgba(15, 23, 42, 0.06)",
        transition: { type: "spring", stiffness: 260, damping: 24 },
    },
    hover: {
        y: -8,
        backgroundColor: CI_LIGHT_BLUE,
        boxShadow: "0 24px 60px rgba(15, 23, 42, 0.12)",
        transition: { type: "spring", stiffness: 260, damping: 24 },
    },
};

// wichtig: immer gleiche Höhe/Breite + rounded-full -> garantiert rund
const iconWrapperVariants = {
    rest: {
        scale: 1,
        backgroundColor: "rgba(0,0,0,0)", // unsichtbar
    },
    hover: {
        scale: 1.15,
        backgroundColor: CI_ICON_BG_HOVER,
    },
};

const iconVariants = {
    rest: {
        scale: 1,
        filter: "brightness(1)",
    },
    hover: {
        scale: 1.15, // etwas kleiner als vorher, damit Luft bleibt
        filter: "brightness(0) invert(1)", // Icon weiß
    },
};

const linkTextVariants = {
    rest: { x: 0 },
    hover: { x: 2 },
};

export default function LeistungCard({ title, slug, description, iconSrc }) {
    const src = iconSrc?.src || iconSrc;

    return (
        <Link href={`/leistungen/${slug}`} className="block w-full max-w-full">
            <motion.article
                className="
                    rounded-3xl 
                    p-6 md:p-8 
                    shadow-lg shadow-primary-900/10 
                    cursor-pointer
                "
                initial="rest"
                animate="rest"
                whileHover="hover"
                variants={cardVariants}
            >
                <div className="flex items-start gap-6 font-body">
                    {/* ICON + KREIS NUR IM HOVER SICHTBAR */}
                    <motion.div
                        className="
                            flex flex-shrink-0 items-center justify-center 
                            h-16 w-16 md:h-18 md:w-18
                            rounded-full
                        "
                        variants={iconWrapperVariants}
                    >
                        <motion.img
                            src={src}
                            alt={title}
                            className="h-9 w-9 md:h-10 md:w-10"
                            loading="lazy"
                            variants={iconVariants}
                        />
                    </motion.div>

                    <div className="flex flex-col gap-2">
                        <H3 className="text-xl font-semibold text-primary-900">{title}</H3>
                        <p className="text-sm italic text-delft">{description}</p>
                    </div>
                </div>

                <motion.span
                    className="mt-6 block text-sm font-semibold text-delft underline underline-offset-4"
                    variants={linkTextVariants}
                >
                    Mehr erfahren
                </motion.span>
            </motion.article>
        </Link>
    );
}
