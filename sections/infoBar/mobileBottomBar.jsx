import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { PiClockLight, PiPhoneLight, PiEnvelopeLight, PiXLight } from "react-icons/pi";

export default function MobileBottomBar() {
    const [openSheet, setOpenSheet] = useState(null); // 'hours' | 'contact' | null

    const close = () => setOpenSheet(null);

    return (
        <>
            {/* fixe Bottom-Bar */}
            <div className="md:hidden fixed inset-x-0 bottom-0 z-40">
                <div className="mx-auto max-w-[480px]">
                    <div className="flex items-stretch justify-between bg-white/95 backdrop-blur shadow-[0_-10px_30px_rgba(15,23,42,0.12)] border-t border-primary-100 px-6 py-3">
                        <button
                            className="flex flex-1 items-center justify-center gap-2 text-[13px] font-medium tracking-wide text-delft"
                            onClick={() => setOpenSheet("hours")}
                        >
                            <PiClockLight className="text-lg" />
                            <span>Öffnungszeiten</span>
                        </button>
                        <span className="mx-4 h-6 w-px bg-primary-100/80" />
                        <button
                            className="flex flex-1 items-center justify-center gap-2 text-[13px] font-medium tracking-wide text-delft"
                            onClick={() => setOpenSheet("contact")}
                        >
                            <PiPhoneLight className="text-lg" />
                            <span>Kontakt</span>
                        </button>
                    </div>
                </div>
            </div>

            {/* Modal / Bottom-Sheet */}
            <AnimatePresence>
                {openSheet && (
                    <motion.div
                        className="fixed inset-0 z-50 flex items-end justify-center md:hidden"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                    >
                        {/* Backdrop */}
                        <div className="absolute inset-0 bg-black/35" onClick={close} />

                        {/* Sheet */}
                        <motion.div
                            initial={{ y: "100%" }}
                            animate={{ y: 0 }}
                            exit={{ y: "100%" }}
                            transition={{ duration: 0.25, ease: [0.2, 0.8, 0.2, 1] }}
                            className="relative z-10 w-full max-w-[480px] rounded-t-3xl bg-white px-6 pt-4 pb-8 shadow-[0_-20px_60px_rgba(15,23,42,0.45)]"
                        >
                            <div className="flex items-center justify-between mb-3">
                                <div className="h-1 w-10 rounded-full bg-primary-100" />
                                <button onClick={close} className="p-1 rounded-full hover:bg-primary-50/80 text-delft">
                                    <PiXLight className="text-xl" />
                                </button>
                            </div>

                            {openSheet === "hours" && (
                                <div>
                                    <h2 className="text-sm font-semibold tracking-wide text-delft mb-3">
                                        Öffnungszeiten
                                    </h2>
                                    <div className="space-y-3 text-[13px] tracking-wide text-delft-900/90">
                                        <div>
                                            <div className="font-medium">Mo, Di, Do</div>
                                            <div className="mt-1">
                                                <span className="font-semibold">08:00 – 13:00</span>
                                                <span className="mx-2 text-delft-900/50">|</span>
                                                <span className="font-semibold">14:30 – 18:00</span>
                                            </div>
                                        </div>
                                        <div>
                                            <div className="font-medium">Mi, Fr</div>
                                            <div className="mt-1">
                                                <span className="font-semibold">08:00 – 14:00</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {openSheet === "contact" && (
                                <div>
                                    <h2 className="text-sm font-semibold tracking-wide text-delft mb-3">Kontakt</h2>
                                    <div className="space-y-3 text-[13px] tracking-wide text-delft-900/90">
                                        <div className="flex items-center gap-3">
                                            <PiPhoneLight className="text-lg text-delft" />
                                            <a href="tel:06190989500" className="font-semibold hover:text-delft-900">
                                                06190-989500
                                            </a>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <PiEnvelopeLight className="text-lg text-delft" />
                                            <a
                                                href="mailto:kollegen@zahnarzt-koehnke.de"
                                                className="font-semibold hover:text-delft-900 break-all"
                                            >
                                                kollegen@zahnarzt-koehnke.de
                                            </a>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
