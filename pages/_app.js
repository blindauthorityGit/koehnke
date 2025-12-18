import "@/styles/globals.css";
import Menu from "@/sections/menu";
import Footer from "@/sections/footer";
import { AppointmentModalProvider } from "@/components/appointments/appointmentModalProvider";

export default function App({ Component, pageProps }) {
    return (
        <AppointmentModalProvider>
            <Menu />
            <Component {...pageProps} />;
            <Footer />
        </AppointmentModalProvider>
    );
}
