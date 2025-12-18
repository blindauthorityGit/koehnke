import Head from "next/head";
import { sanityClient } from "@/client";
import { contactPageQuery } from "@/libs/queries";

import ContactHero from "@/sections/contactHero";

export async function getStaticProps() {
    const contactPage = await sanityClient.fetch(contactPageQuery);

    return {
        props: {
            contactPage: contactPage || null,
        },
        revalidate: 60,
    };
}

export default function Kontakt({ contactPage }) {
    if (!contactPage) return null;

    return (
        <>
            <Head>
                <title>{contactPage.title || "Kontakt"}</title>
                <meta name="description" content={contactPage.intro || "Kontakt & Anfahrt"} />
            </Head>

            <main>
                <ContactHero page={contactPage} />
            </main>
        </>
    );
}
