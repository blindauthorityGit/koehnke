import { BsTelephone, BsCalendar2Check } from "react-icons/bs";
import Link from "next/link";
import AppointmentRequestForm from "@/components/appointments/appointmentRequestForm";

export default function TerminPage() {
    return (
        <main className="bg-primary-50">
            <section className="mx-auto max-w-3xl px-4 pt-10 pb-6">
                <div className="rounded-[28px] bg-white p-6 shadow-sm ring-1 ring-black/10">
                    <div className="flex items-start gap-4">
                        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary-50 ring-1 ring-black/10">
                            <BsCalendar2Check className="h-6 w-6 text-delft" />
                        </div>
                        <div className="min-w-0">
                            <h1 className="text-2xl font-semibold text-delft">Termin vereinbaren</h1>
                            <p className="mt-2 text-sm leading-relaxed text-delft/80">
                                Für eine schnelle Terminabstimmung empfehlen wir die{" "}
                                <span className="font-semibold text-delft">telefonische Terminvereinbarung</span>.
                                Alternativ können Sie unten eine Anfrage senden.
                            </p>
                        </div>
                    </div>

                    <div className="mt-5 grid gap-3 sm:grid-cols-2">
                        <a
                            href="tel:06190989500"
                            className="inline-flex items-center justify-center gap-2 rounded-full bg-delft px-5 py-3 text-sm font-semibold text-white hover:bg-delft/90"
                        >
                            <BsTelephone className="h-4 w-4" />
                            06190-989500
                        </a>

                        <Link
                            href="/kontakt"
                            className="inline-flex items-center justify-center rounded-full border border-black/10 px-5 py-3 text-sm font-semibold text-delft hover:bg-black/5"
                        >
                            Kontaktseite
                        </Link>
                    </div>
                </div>
            </section>

            <section className="mx-auto max-w-3xl px-4 pb-14">
                <div className="rounded-[28px] bg-white p-6 shadow-sm ring-1 ring-black/10">
                    <div className="mb-4 text-sm font-semibold text-delft">Terminanfrage (Alternative)</div>

                    <AppointmentRequestForm
                        endpoint="/api/appointments/request"
                        onClose={null}
                        closeOnSuccess={false}
                    />
                </div>
            </section>
        </main>
    );
}
