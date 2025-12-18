import { sanityClient } from "@/client";
import { homePageQuery, teamMembersQuery } from "@/libs/queries";

import Hero from "@/sections/hero";
import InfoBar from "@/sections/infoBar";
import MobileBottomBar from "@/sections/infoBar/mobileBottomBar";
import TextImage from "@/sections/textImageFull";
import HeroImg from "@/assets/hero.png";
import LeistungenSection from "@/sections/leistungen";
import TeamSection from "@/sections/teamOverview";
import AppointmentCTASection from "@/sections/cta";
import ImageGrid from "@/sections/imgGridStart";

//query
import { servicesForHomeQuery } from "@/libs/queries";

export async function getStaticProps() {
    const data = await sanityClient.fetch(homePageQuery);
    const teamMembers = await sanityClient.fetch(teamMembersQuery);

    return {
        props: {
            startPage: data?.startPage || null,
            settings: data?.settings || null,
            teamSection: data?.teamSection || null,
            services: data?.services || [],
            teamMembers: teamMembers || [],
        },
        revalidate: 60,
    };
}

export default function Home({ startPage, settings, teamMembers, services }) {
    const textImageSectionData = startPage?.textImageSection || null;
    const galleryImages = startPage?.gallery || [];

    return (
        <div className="min-h-screen bg-primary-50">
            <main>
                <Hero data={startPage} settings={settings} />
                <InfoBar />
                <MobileBottomBar />
                <TextImage section={textImageSectionData} id="welcome" whiteBG={false} withWave={false} />
                <LeistungenSection services={services} />
                <TeamSection members={teamMembers} />
                <AppointmentCTASection />
                <ImageGrid images={galleryImages} />
            </main>
        </div>
    );
}
