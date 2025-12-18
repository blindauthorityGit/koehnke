// components/sections/ImageGrid.jsx
import Image from "next/image";
import { urlFor } from "@/function/urlFor";

function GridImage({ img, className = "" }) {
    if (!img?.asset) return null;

    const src = urlFor(img).width(1600).quality(80).url();
    const alt = img?.isDecorative ? "" : img?.alt || "Praxisbild";
    const lqip = img?.asset?.metadata?.lqip;

    return (
        <div className={`relative overflow-hidden rounded-2xl ${className}`}>
            <Image
                src={src}
                alt={alt}
                fill
                sizes="(min-width: 1024px) 50vw, 100vw"
                className="object-cover"
                {...(lqip ? { placeholder: "blur", blurDataURL: lqip } : { placeholder: "empty" })}
                {...(img?.isDecorative ? { role: "presentation", "aria-hidden": true } : {})}
            />
        </div>
    );
}

export default function ImageGrid({ images = [] }) {
    if (!images?.length) return null;

    const left = images.slice(0, 3);
    const right = images.slice(3, 5);

    return (
        <section className="bg-primary-50 py-20 md:py-24">
            <div className="mx-auto max-w-6xl px-4">
                <div className="grid gap-6 lg:grid-cols-[minmax(0,2fr)_minmax(0,1.1fr)]">
                    {/* LINKS */}
                    <div className="grid gap-6 md:grid-cols-2">
                        {/* groß */}
                        {left[0] ? (
                            <GridImage
                                img={left[0]}
                                className="md:col-span-2 aspect-[16/10] md:aspect-[16/8] lg:aspect-[16/7]"
                            />
                        ) : null}

                        {/* klein */}
                        {left.slice(1).map((img) => (
                            <GridImage
                                key={img._key || img.asset?._id}
                                img={img}
                                className="aspect-[16/10] md:aspect-[16/9]"
                            />
                        ))}
                    </div>

                    {/* RECHTS */}
                    <div className="grid gap-6">
                        {right.map((img) => (
                            <GridImage
                                key={img._key || img.asset?._id}
                                img={img}
                                className="aspect-[16/10] md:aspect-[16/9]"
                            />
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
