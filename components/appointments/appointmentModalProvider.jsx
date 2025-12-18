// components/appointments/AppointmentModalProvider.jsx
import { createContext, useContext, useMemo, useState, useCallback } from "react";
import { useRouter } from "next/router";
import AppointmentRequestModal from "./appointmentRequestModal";

const AppointmentModalContext = createContext(null);

function isMobileViewport() {
    if (typeof window === "undefined") return false;
    return window.matchMedia("(max-width: 767px)").matches; // < md
}

export function AppointmentModalProvider({ children }) {
    const router = useRouter();
    const [isOpen, setIsOpen] = useState(false);

    const openAppointment = useCallback(() => {
        if (isMobileViewport()) {
            router.push("/termin");
            return;
        }
        setIsOpen(true);
    }, [router]);

    const closeAppointment = useCallback(() => setIsOpen(false), []);

    const value = useMemo(
        () => ({ openAppointment, closeAppointment, isOpen }),
        [openAppointment, closeAppointment, isOpen]
    );

    return (
        <AppointmentModalContext.Provider value={value}>
            {children}
            <AppointmentRequestModal isOpen={isOpen} onClose={closeAppointment} />
        </AppointmentModalContext.Provider>
    );
}

export function useAppointmentModal() {
    console.log("GEHEHE");
    const ctx = useContext(AppointmentModalContext);
    if (!ctx) throw new Error("useAppointmentModal must be used within AppointmentModalProvider");
    return ctx;
}
