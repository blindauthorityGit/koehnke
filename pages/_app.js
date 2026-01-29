import "@/styles/globals.css";
import { useEffect, useState } from "react";

import Menu from "@/sections/menu";
import Footer from "@/sections/footer";
import { AppointmentModalProvider } from "@/components/appointments/appointmentModalProvider";

import PracticeModal from "@/components/modals/PracticeModal"; // <- anpassen, falls Pfad anders

import { sanityClient } from "@/client";
import { PRACTICE_MODAL_QUERY } from "@/libs/queries";
import CookieBanner from "@/components/cookieBanner";

export default function App({ Component, pageProps }) {
    const [modalData, setModalData] = useState(null);

    useEffect(() => {
        let cancelled = false;

        async function loadPracticeModal() {
            try {
                // Direkt aus Sanity holen (Client-side)
                const data = await sanityClient.fetch(PRACTICE_MODAL_QUERY);
                console.log(data);
                if (!cancelled) setModalData(data || null);
            } catch (e) {
                if (!cancelled) setModalData(null);
            }
        }

        loadPracticeModal();

        return () => {
            cancelled = true;
        };
    }, []);

    return (
        <AppointmentModalProvider>
            {/* Global Praxis-Modal */}
            <PracticeModal data={modalData} />

            <Menu />
            <Component {...pageProps} />
            <CookieBanner />

            <Footer />
        </AppointmentModalProvider>
    );
}
