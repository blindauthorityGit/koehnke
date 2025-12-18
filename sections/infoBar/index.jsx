import { PiClockLight, PiPhoneLight, PiEnvelopeLight } from "react-icons/pi";

export default function InfoBar() {
    return (
        <section className="hidden md:block pb-10 md:pb-12 -mt-16 md:-mt-20 relative z-30">
            <div className="container mx-auto">
                <div className="rounded-3xl bg-white shadow-[0_24px_80px_rgba(15,23,42,0.08)] px-4 py-4 sm:px-6 sm:py-5 lg:px-10 lg:py-6">
                    <div
                        className="flex flex-col gap-4 text-xs sm:text-[13px] lg:text-sm text-delft-900
                                    md:grid md:grid-cols-2 lg:flex lg:flex-row lg:items-center lg:justify-between"
                    >
                        {/* Öffnungszeiten Block 1 */}
                        <div className="flex flex-1 items-center gap-3 min-w-[220px]">
                            <span className="text-xl text-delft">
                                <PiClockLight />
                            </span>
                            <div>
                                <div className="font-medium tracking-wider">Mo, Di, Do</div>
                                <div className="mt-1 tracking-wide text-delft-900/80 2xl:text-xl">
                                    <span className="font-semibold">08:00 – 13:00</span>
                                    <br></br>
                                    {/* <span className="mx-2 text-delft-900/50 ">|</span> */}
                                    <span className="font-semibold">14:30 – 18:00</span>
                                </div>
                            </div>
                        </div>

                        {/* Öffnungszeiten Block 2 */}
                        <div className="flex flex-1 items-center gap-3 min-w-[190px]">
                            <span className="text-xl text-delft opacity-70">
                                <PiClockLight />
                            </span>
                            <div>
                                <div className="font-medium tracking-wider">Mi, Fr</div>
                                <div className="mt-1 tracking-wide text-delft-900/80 2xl:text-xl">
                                    <span className="font-semibold">08:00 – 14:00</span>
                                </div>
                            </div>
                        </div>

                        {/* Telefon */}
                        <div className="flex flex-1 items-center gap-3 min-w-[190px]">
                            <span className="text-xl text-delft">
                                <PiPhoneLight />
                            </span>
                            <div>
                                <div className="font-medium tracking-wider">Telefon</div>
                                <a
                                    href="tel:06190989500"
                                    className="mt-1 block 2xl:text-xl font-semibold tracking-wide text-delft-900/90 hover:text-delft-900"
                                >
                                    06190-989500
                                </a>
                            </div>
                        </div>

                        {/* E-Mail */}
                        <div className="flex flex-1 items-center gap-3 min-w-[230px]">
                            <span className="text-xl text-delft">
                                <PiEnvelopeLight />
                            </span>
                            <div>
                                <div className="font-medium tracking-wider">E-Mail</div>
                                <a
                                    href="mailto:kollegen@zahnarzt-koehnke.de"
                                    className="mt-1 2xl:text-xl  block font-semibold tracking-wide text-delft-900/90 hover:text-delft-900 break-all md:break-normal"
                                >
                                    kollegen@zahnarzt-koehnke.de
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
