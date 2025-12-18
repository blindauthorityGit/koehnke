// components/sections/ImageTextSection.jsx
import Image from "next/image";

import { H2 } from "@/typography/headlines";

export default function ImageTextSection({
    title,
    eyebrow,
    children,
    image,
    imageAlt,
    reverse = false,
    className = "",
}) {
    return (
        <section className={`w-full py-16 md:py-24 ${className}`}>
            <div
                className={`
          mx-auto flex container flex-col gap-30 px-4 sm:px-6 lg:px-8
          lg:grid lg:grid-cols-2 lg:items-center
          ${reverse ? "lg:[direction:rtl]" : ""}
        `}
            >
                {/* IMAGE */}
                <div className="relative h-[260px] overflow-hidden rounded-3xl sm:h-[320px] md:h-[380px] lg:h-[480px] lg:rounded-[48px] lg:[direction:ltr]">
                    <Image
                        src={image}
                        alt={imageAlt}
                        fill
                        priority
                        sizes="(min-width: 1024px) 50vw, 100vw"
                        className="object-cover"
                    />
                </div>

                {/* TEXT */}
                <div className="lg:[direction:ltr]">
                    {eyebrow && (
                        <p className="mb-3 text-sm font-medium uppercase tracking-[0.16em] text-primary-500">
                            {eyebrow}
                        </p>
                    )}

                    <H2 className="mb-12 text-3xl font-semibold leading-snug text-slate-900 sm:text-4xl md:text-[2.5rem]">
                        {title}
                    </H2>

                    <div className="space-y-4 text-base leading-[166%] text-delft md:text-[1.05rem] tracking-wider">
                        {children}
                    </div>
                </div>
            </div>
        </section>
    );
}
