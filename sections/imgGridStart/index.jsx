// components/sections/ImageGrid.jsx

import Image from "next/image";

import Img1 from "@/assets/images/praxis1.jpg";

// linke Seite: 1 großes + 2 kleine
const LEFT_IMAGES = [
    { src: Img1, alt: "Behandlungsraum" }, // oben, groß
    { src: Img1, alt: "Behandlung" }, // unten links
    { src: Img1, alt: "Kinderbehandlung" }, // unten rechts
];

// rechte Seite: 2 übereinander
const RIGHT_IMAGES = [
    { src: Img1, alt: "Zahnarztstuhl" }, // oben rechts
    { src: Img1, alt: "Zahnuntersuchung" }, // unten rechts
];

export default function ImageGrid() {
    return (
        <section className="bg-primary-50 py-20 md:py-24">
            <div className="max-w-6xl mx-auto px-4">
                {/* Outer Layout: links (2/3), rechts (1/3) */}
                <div className="grid gap-6 lg:grid-cols-[minmax(0,2fr)_minmax(0,1.1fr)]">
                    {/* LINKER BLOCK */}
                    <div className="grid gap-6 md:grid-cols-2">
                        {LEFT_IMAGES.map((img, index) => (
                            <div
                                key={index}
                                className={`
                                    overflow-hidden rounded-2xl 
                                    ${index === 0 ? "md:col-span-2 aspect-[16/7]" : "aspect-[16/9]"}
                                `}
                            >
                                <Image
                                    src={img.src}
                                    alt={img.alt}
                                    className="h-full w-full object-cover"
                                    placeholder="blur"
                                />
                            </div>
                        ))}
                    </div>

                    {/* RECHTER BLOCK */}
                    <div className="grid gap-6">
                        {RIGHT_IMAGES.map((img, index) => (
                            <div key={index} className="overflow-hidden rounded-2xl aspect-[16/9]">
                                <Image
                                    src={img.src}
                                    alt={img.alt}
                                    className="h-full w-full object-cover"
                                    placeholder="blur"
                                />
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
