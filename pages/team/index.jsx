// pages/team.js
import Head from "next/head";

import { sanityClient } from "@/client";
import { teamPageQuery } from "@/libs/queries";

import PageHero from "@/sections/heroPages";
import InfoBar from "@/sections/infoBar";
import AppointmentCTASection from "@/sections/cta";

import TeamMember from "@/components/team/card";
import { urlFor } from "@/function/urlFor";

export async function getStaticProps() {
    const data = await sanityClient.fetch(teamPageQuery);

    return {
        props: { data },
        revalidate: 60,
    };
}

export default function TeamPage({ data }) {
    const page = data?.page;
    if (!page) return null;

    const heroImage = page.heroImage || page.seo?.ogImage;

    const title = page?.seo?.title || page.heroTitle || "Team";
    const description = page?.seo?.description || page.heroSubtitle || "";

    return (
        <>
            <Head>
                <title>{title}</title>
                {description ? <meta name="description" content={description} /> : null}
            </Head>

            <PageHero title={page.heroTitle} subtitle={page.heroSubtitle} image={heroImage} />
            <InfoBar />

            {/* Team Grid */}
            <section className="py-16 md:py-20">
                <div className="mx-auto max-w-6xl px-4 md:px-6 lg:px-8">
                    <div
                        className="
                            grid grid-cols-1 gap-y-16 gap-x-10
                            md:grid-cols-2 md:gap-y-20
                        "
                    >
                        {page.teamMembers?.map((member) => {
                            const imgUrl = member?.image ? urlFor(member.image).width(900).url() : null;

                            const alt = member?.image?.isDecorative
                                ? ""
                                : member?.image?.alt || member?.title || "Teammitglied";

                            return (
                                <TeamMember
                                    key={member._id}
                                    photo={imgUrl}
                                    name={member.title}
                                    role={member.subtitle}
                                    teaser={member.teaser}
                                    alt={alt}
                                />
                            );
                        })}
                    </div>
                </div>
            </section>

            <AppointmentCTASection />
        </>
    );
}
