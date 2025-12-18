// components/cta/AppointmentCTASection.jsx

import { BsClock, BsTelephone, BsCalendar } from "react-icons/bs";
import { H2 } from "@/typography/headlines";
import BasicButton from "@/components/buttons/basicButton";

import { useAppointmentModal } from "@/components/appointments/appointmentModalProvider";

export default function AppointmentCTASection() {
    const { openAppointment } = useAppointmentModal();

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
                    {/* Headline */}
                    <H2 klasse="">Jetzt Termin vereinbaren</H2>

                    {/* Intro-Text */}
                    <p className="mx-auto mb-10 max-w-2xl text-sm md:text-base text-delft leading-relaxed">
                        Moderne Zahnmedizin, persönliche Betreuung und einfühlsame Behandlung – für gesunde Zähne und
                        ein strahlendes Lächeln, das bleibt.
                    </p>

                    {/* Öffnungszeiten */}
                    <div className="mx-auto mb-10 flex max-w-xl flex-col gap-3 text-sm md:text-base text-delft">
                        <div className="flex flex-col items-center gap-1 md:flex-row md:justify-center md:gap-4">
                            <div className="flex items-center gap-2 text-delft">
                                <BsClock className="h-4 w-4" />
                                <span>Mo, Di, Do</span>
                            </div>
                            <div className="font-semibold">08:00 - 13:00 | 14:30 - 18:00</div>
                        </div>

                        <div className="flex flex-col items-center gap-1 md:flex-row md:justify-center md:gap-4">
                            <div className="flex items-center gap-2 text-delft">
                                <span>Mi, Fr</span>
                            </div>
                            <div className="font-semibold">08:00 - 14:00</div>
                        </div>

                        <div className="mt-4 flex flex-col items-center gap-1 md:flex-row md:justify-center md:gap-3">
                            <div className="flex items-center gap-2 text-delft">
                                <BsTelephone className="h-4 w-4" />
                                <span className="font-semibold">06190-989500</span>
                            </div>
                        </div>
                    </div>

                    {/* CTA Button – jetzt BasicButton (weiß) */}
                    <div className="flex justify-center">
                        <BasicButton
                            onClick={openAppointment} // 👈 DAS ist der Trigger
                            text="Termin online vereinbaren"
                            icon={<BsCalendar className="h-4 w-4" />}
                            className="bg-white text-delft hover:bg-delft"
                        >
                            Termin vereinbaren
                        </BasicButton>
                    </div>
                </div>
            </div>
        </section>
    );
}
