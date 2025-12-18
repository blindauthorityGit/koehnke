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
                    {/* Mobile overlay for readability */}
                    <div className="absolute inset-0 bg-gradient-to-b from-primary-50/85 via-primary-50/55 to-primary-50/95" />
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
                <div className="md:hidden flex h-full">
                    <div className="w-full flex flex-col justify-end pb-6">
                        {/* Content Card */}
                        <div className="w-full max-w-[520px] rounded-[28px] bg-white/80 backdrop-blur-md ring-1 ring-black/10 p-5">
                            {heroSubtitle && (
                                <p className="text-sm font-body mb-3 leading-relaxed tracking-wide text-delft/85">
                                    {heroSubtitle}
                                </p>
                            )}

                            <H1 className="text-delft font-thin text-[2.1rem] leading-[1.05]">{heroTitle}</H1>

                            <div className="mt-5 flex flex-col gap-3">
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

                            <p className="mt-3 text-xs text-delft/60 leading-relaxed">
                                Hinweis: Auf Mobilgeräten öffnen wir eine eigene Terminseite. Am Desktop erscheint das
                                Termin-Modal.
                            </p>
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
