import Head from "next/head";

import { sanityClient } from "@/client";
import { jobSlugsQuery, singleJobQuery } from "@/libs/queries";

import DetailHero from "@/sections/heroDetail";
import InfoBar from "@/sections/infoBar";
import JobApplyCTASection from "@/sections/jobApplyCTASection";

// Mini-Section für Überschrift + Bullets (wie im Design)
function BulletSection({ title, items }) {
    if (!title || !items?.length) return null;

    return (
        <section className="py-10 md:py-14">
            <div className="mx-auto max-w-6xl px-4 md:px-6 lg:px-8">
                <h2 className="font-thin text-delft text-3xl md:text-4xl mb-6">{title}</h2>

                <ul className="space-y-3 text-delft/90 tracking-wide leading-relaxed">
                    {items.map((item, idx) => (
                        <li key={idx} className="flex gap-3">
                            <span className="mt-[0.55rem] h-[4px] w-[4px] rounded-full bg-delft/60 shrink-0" />
                            <span>{item}</span>
                        </li>
                    ))}
                </ul>
            </div>
        </section>
    );
}

export async function getStaticPaths() {
    const slugs = await sanityClient.fetch(jobSlugsQuery);

    const paths = (slugs || []).map((slug) => ({
        params: { slug },
    }));

    return {
        paths,
        fallback: "blocking",
    };
}

export async function getStaticProps({ params }) {
    const job = await sanityClient.fetch(singleJobQuery, { slug: params.slug });

    if (!job) {
        return { notFound: true, revalidate: 60 };
    }

    return {
        props: { job },
        revalidate: 60,
    };
}

export default function JobDetailPage({ job }) {
    if (!job) return null;
    console.log(job.job);
    const heroImage = job.job.image || job.seo?.ogImage;
    console.log(heroImage);

    const title = job?.seo?.title || job.title || "Offene Stelle";
    const description =
        job?.seo?.description ||
        job.subtitle ||
        "Informieren Sie sich über Aufgaben, Profil und Benefits dieser offenen Stelle.";

    return (
        <>
            <Head>
                <title>{title}</title>
                {description ? <meta name="description" content={description} /> : null}

                {/* Optional: OG */}
                <meta property="og:title" content={title} />
                {description ? <meta property="og:description" content={description} /> : null}
            </Head>

            <DetailHero title={job.job.title} subtitle={job.job.teaser} image={heroImage} />
            <InfoBar />

            {/* Aufgaben / Profil / Benefits */}
            <div className="bg-primary-50">
                <BulletSection
                    title="Ihre Aufgaben"
                    items={(job.job.tasks || []).map((x) => x?.text).filter(Boolean)}
                />
                <BulletSection title="Ihr Profil" items={(job.job.profile || []).map((x) => x?.text).filter(Boolean)} />

                {/* Optional: Welle/Abschluss kannst du hier wie bei dir üblich einbauen */}
                <BulletSection
                    title="Unsere Benefits"
                    items={(job.job.benefits || []).map((x) => x?.text).filter(Boolean)}
                />
            </div>

            <JobApplyCTASection
                title="Jetzt bewerben"
                text={`Interesse an der Position "${job.job.title}"? Bewerben Sie sich unkompliziert und lernen Sie unser Team kennen.`}
            />
        </>
    );
}
