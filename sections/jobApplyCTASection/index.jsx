import { BsEnvelope, BsPersonCheck } from "react-icons/bs";
import { H2 } from "@/typography/headlines";
import BasicButton from "@/components/buttons/basicButton";

export default function JobApplyCTASection({
    title = "Jetzt bewerben",
    text = "Werden Sie Teil unseres Teams und gestalten Sie moderne Zahnmedizin in einem wertschätzenden Umfeld mit.",
    link = "/bewerbung", // Zielseite (kommt später)
}) {
    return (
        <section className="relative z-40 py-16 md:py-24">
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
                    {/* Headline */}
                    <H2>{title}</H2>

                    {/* Intro-Text */}
                    <p className="mx-auto mb-10 max-w-2xl text-sm md:text-base text-delft leading-relaxed">{text}</p>

                    {/* CTA Button */}
                    <div className="flex justify-center">
                        <BasicButton
                            link={link}
                            text="Jetzt bewerben"
                            icon={<BsPersonCheck className="h-4 w-4" />}
                            className="bg-white text-delft hover:bg-white/90"
                        >
                            Jetzt bewerben
                        </BasicButton>
                    </div>
                </div>
            </div>
        </section>
    );
}
