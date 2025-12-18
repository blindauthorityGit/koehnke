import Image from "next/image";
import { H1 } from "@/typography/headlines";
import { PrimaryButton } from "@/components/buttons";
import { BsCalendar } from "react-icons/bs";
import { urlFor } from "@/function/urlFor";
import { useAppointmentModal } from "@/components/appointments/appointmentModalProvider";

export default function Hero({ data }) {
    const { openAppointment } = useAppointmentModal();
    if (!data) return null;

    const { heroTitle, heroSubtitle, heroImage } = data;

    const imageUrl = heroImage ? urlFor(heroImage).url() : null;
    const imageAlt = heroImage?.isDecorative ? "" : heroImage?.alt || heroTitle || "";

    return (
        <section
            className="
                relative overflow-hidden bg-primary-50
                pt-10 pb-10 md:pb-32 lg:pt-24 lg:h-[720px] 2xl:h-[860px]
                h-[calc(100svh-120px)] md:min-h-0
            "
        >
            {/* MOBILE BG IMAGE */}
            {imageUrl && (
                <div className="absolute inset-0 md:hidden">
                    <Image
                        src={imageUrl}
                        alt={imageAlt}
                        fill
                        priority
                        className="object-cover object-right"
                        {...(heroImage?.isDecorative ? { role: "presentation", "aria-hidden": true } : {})}
                    />
                    {/* softer overlay (weniger "milchig", aber Foto tritt zurück) */}
                    <div className="absolute inset-0 bg-primary-50/40" />
                </div>
            )}

            {/* DESKTOP BG IMAGE */}
            {imageUrl && (
                <div className="hidden md:block absolute inset-y-0 right-0 w-[58%] max-w-[980px]">
                    <Image
                        src={imageUrl}
                        alt={imageAlt}
                        fill
                        priority
                        className="object-contain object-right"
                        {...(heroImage?.isDecorative ? { role: "presentation", "aria-hidden": true } : {})}
                    />
                </div>
            )}

            {/* CONTENT */}
            <div className="container relative z-10 mx-auto h-full px-4">
                {/* MOBILE */}
                <div className="md:hidden flex h-full items-end pb-6">
                    <div className="w-full">
                        {/* Content Card (ruhig, klar, freundlich) */}
                        <div
                            className="
                                w-full max-w-[520px]
                                rounded-[28px]
                                bg-white
                                shadow-md
                                ring-1 ring-black/10
                                px-6 py-6
                            "
                        >
                            {/* Mobile hardcoded Subline */}
                            <p className="mb-3 text-sm font-body leading-relaxed tracking-wide text-delft/80">
                                Moderne Zahnmedizin mit persönlicher Betreuung.
                            </p>

                            <H1 className="text-delft font-thin text-[1.9rem] leading-[1.15]">{heroTitle}</H1>

                            {/* Button: UNVERÄNDERT */}
                            <div className="mt-6 flex flex-col gap-3">
                                <PrimaryButton
                                    type="button"
                                    onClick={openAppointment}
                                    icon={<BsCalendar />}
                                    className="w-full justify-center"
                                    variant="mint"
                                >
                                    Termin vereinbaren
                                </PrimaryButton>
                            </div>
                        </div>
                    </div>
                </div>

                {/* DESKTOP */}
                <div className="hidden md:block max-w-xl lg:max-w-2xl pt-14">
                    <H1
                        className="
                            text-delft font-thin
                            text-4xl leading-tight
                            sm:text-5xl
                            md:text-6xl
                            lg:text-7xl
                        "
                    >
                        {heroTitle}
                    </H1>

                    {heroSubtitle && (
                        <p className="mt-6 font-body max-w-md text-base 2xl:text-lg leading-relaxed text-delft tracking-wide">
                            {heroSubtitle}
                        </p>
                    )}

                    <div className="mt-12 flex flex-col sm:flex-row gap-4">
                        <PrimaryButton type="button" onClick={openAppointment} icon={<BsCalendar />} variant="mint">
                            Termin vereinbaren
                        </PrimaryButton>
                    </div>
                </div>
            </div>
        </section>
    );
}
