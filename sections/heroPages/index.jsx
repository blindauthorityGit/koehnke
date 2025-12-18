// components/sections/ServicesHero.jsx
import Image from "next/image";
import { urlFor } from "@/function/urlFor";
import { H1 } from "@/typography/headlines";

export default function PageHero({ title, subtitle, image }) {
    const imgUrl = image ? urlFor(image.asset || image).url() : null;

    return (
        <section
            className="
                relative overflow-hidden bg-primary-50
                pt-10 pb-16 md:pb-32 lg:pt-24 lg:h-[720px] 2xl:h-[860px]
                h-[calc(100svh-120px)] md:min-h-0
            "
        >
            {/* MOBILE: vollflächiges Hintergrundbild */}
            {imgUrl && (
                <div className="absolute inset-0 md:hidden">
                    <Image
                        src={imgUrl}
                        alt={title || "Unsere Leistungen"}
                        fill
                        priority
                        className="object-cover object-center"
                    />
                    {/* leichte Aufhellung, damit Text lesbar bleibt */}
                    <div className="absolute inset-0 bg-primary-50/60" />
                </div>
            )}

            {/* DESKTOP: Bild LINKS im Hintergrund */}
            {imgUrl && (
                <div
                    className="
                        hidden md:block absolute inset-y-0 left-0
                        w-[55%] lg:w-[50%] xl:w-[55%] 2xl:w-[58%]
                        max-w-[980px]
                    "
                >
                    <Image
                        src={imgUrl}
                        alt={title || "Unsere Leistungen"}
                        fill
                        priority
                        className="object-contain object-left"
                    />
                </div>
            )}

            {/* CONTENT */}
            <div className="container relative z-10 mx-auto h-full">
                {/* ---------------- MOBILE CONTENT ---------------- */}
                <div className="md:hidden flex h-full">
                    <div
                        className="
                            flex flex-col justify-end
                            w-full
                            px-6 pb-10
                        "
                    >
                        {title && (
                            <div className="inline-block rounded-2xl bg-primary-50/95 px-8 py-6">
                                <H1 className="text-delft font-thin text-3xl leading-snug">{title}</H1>
                            </div>
                        )}

                        {/* Subtext auf Mobile ausgeblendet */}
                        {/* Wenn du irgendwann einen kurzen Teaser willst,
                            können wir hier 1–2 Sätze aus `subtitle` reinnehmen. */}
                    </div>
                </div>

                {/* ---------------- DESKTOP/TABLET CONTENT ---------------- */}
                <div
                    className="
                        hidden md:block
                        md:ml-auto
                        max-w-xl lg:max-w-2xl
                        pt-14
                        md:pl-20 lg:pl-32 xl:pl-56 2xl:pl-48
                    "
                >
                    {title && (
                        <H1
                            className="
                                text-delft font-thin
                                text-4xl leading-tight
                                sm:text-5xl
                                md:text-6xl
                                lg:text-7xl
                            "
                        >
                            {title}
                        </H1>
                    )}

                    {subtitle && (
                        <p className="mt-6 font-body max-w-md text-base 2xl:text-lg leading-relaxed text-delft tracking-wide whitespace-pre-line">
                            {subtitle}
                        </p>
                    )}
                </div>
            </div>
        </section>
    );
}
