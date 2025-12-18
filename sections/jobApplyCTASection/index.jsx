import Link from "next/link";
import { BsPersonCheck } from "react-icons/bs";
import { H2 } from "@/typography/headlines";
import BasicButton from "@/components/buttons/basicButton";

export default function JobApplyCTASection({
    title = "Jetzt bewerben",
    text,
    jobSlug, // 👈 NEU
}) {
    if (!jobSlug) return null;

    const href = `/karriere/bewerben/${jobSlug}`;

    return (
        <section className="relative z-30 py-16 md:py-24">
            <div className="mx-auto container px-4">
                <div
                    className="
                        mx-auto w-full rounded-[40px]
                        bg-[#cfe3f8]
                        px-6 py-10
                        text-center
                        md:px-16 md:py-14
                    "
                >
                    <H2>{title}</H2>

                    {text && (
                        <p className="mx-auto mb-10 max-w-2xl text-sm md:text-base text-delft leading-relaxed">
                            {text}
                        </p>
                    )}

                    <div className="flex justify-center">
                        <Link href={href}>
                            <BasicButton
                                icon={<BsPersonCheck className="h-4 w-4" />}
                                className="bg-white text-delft hover:bg-white/90"
                            >
                                Jetzt bewerben
                            </BasicButton>
                        </Link>
                    </div>
                </div>
            </div>
        </section>
    );
}
