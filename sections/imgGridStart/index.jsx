// components/sections/ImageGrid.jsx
import Image from "next/image";
import { urlFor } from "@/function/urlFor";

function GridImage({ img, className }) {
    if (!img?.asset) return null;

    const src = urlFor(img).width(1600).quality(80).url();
    const alt = img?.isDecorative ? "" : img?.alt || "Praxisbild";

    const lqip = img?.asset?.metadata?.lqip;

    return (
        <div className={`overflow-hidden rounded-2xl ${className}`}>
            <Image
                src={src}
                alt={alt}
                fill
                sizes="(min-width: 1024px) 50vw, 100vw"
                className="h-full w-full object-cover"
                {...(lqip ? { placeholder: "blur", blurDataURL: lqip } : { placeholder: "empty" })}
                {...(img?.isDecorative ? { role: "presentation", "aria-hidden": true } : {})}
            />
        </div>
    );
}

export default function ImageGrid({ images = [] }) {
    if (!images?.length) return null;

    // Erwartet 5 Bilder: 3 links (1 groß + 2 klein), 2 rechts.
    // Wenn weniger: nimmt einfach so viel wie da ist.
    const left = images.slice(0, 3);
    const right = images.slice(3, 5);

    return (
        <section className="bg-primary-50 py-20 md:py-24">
            <div className="max-w-6xl mx-auto px-4">
                <div className="grid gap-6 lg:grid-cols-[minmax(0,2fr)_minmax(0,1.1fr)]">
                    {/* LINKS */}
                    <div className="grid gap-6 md:grid-cols-2">
                        {/* links[0] groß */}
                        {left[0] ? (
                            <div className="relative md:col-span-2 aspect-[16/7]">
                                <GridImage img={left[0]} className="absolute inset-0" />
                            </div>
                        ) : null}

                        {/* links[1], links[2] klein */}
                        {left.slice(1).map((img) => (
                            <div key={img._key || img.asset?._id} className="relative aspect-[16/9]">
                                <GridImage img={img} className="absolute inset-0" />
                            </div>
                        ))}
                    </div>

                    {/* RECHTS */}
                    <div className="grid gap-6">
                        {right.map((img) => (
                            <div key={img._key || img.asset?._id} className="relative aspect-[16/9]">
                                <GridImage img={img} className="absolute inset-0" />
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
