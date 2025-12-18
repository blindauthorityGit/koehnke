// components/layout/WaveSection.jsx
"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

export default function WaveSection({ children, id, className = "" }) {
    const ref = useRef(null);

    const { scrollYProgress } = useScroll({
        target: ref,
        offset: ["start end", "end start"],
    });

    // dein aktueller Parallax-Wert
    const y = useTransform(scrollYProgress, [0, 1], [80, -80]);

    return (
        <section id={id} ref={ref} className={`relative bg-primary-50 pt-40 pb-28 md:pt-56 md:pb-32 ${className}`}>
            {/* Wave Background */}
            <motion.div className="pointer-events-none absolute inset-x-0 -top-10 z-0" style={{ y }} aria-hidden="true">
                <svg
                    viewBox="0 0 1440 600"
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-[500px] md:h-[1200px] w-full"
                    preserveAspectRatio="none"
                >
                    <path
                        fill="#ffffff"
                        d="
                            M0,200
                            C 200,120 400,40 720,120
                            C 1040,200 1240,80 1440,140
                            L1440,480
                            C 1200,540 960,580 720,580
                            C 480,580 240,540 0,480
                            Z
                        "
                    />
                </svg>
            </motion.div>

            {/* Content above the wave */}
            <div className="relative z-10">{children}</div>
        </section>
    );
}
