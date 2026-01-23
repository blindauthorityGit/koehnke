import Head from "next/head";
import { PortableText } from "@portabletext/react";

import { sanityClient } from "@/client";
import { jobSlugsQuery, singleJobQuery } from "@/libs/queries";

import DetailHero from "@/sections/heroDetail";
import InfoBar from "@/sections/infoBar";
import JobApplyCTASection from "@/sections/jobApplyCTASection";

// Optional: kleiner PT-Renderer (saubere Typo + Lists)
const ptComponents = {
    block: {
        h3: ({ children }) => <h2 className="font-thin text-delft text-3xl md:text-4xl mt-10 mb-5">{children}</h2>,
        normal: ({ children }) => <p className="text-delft/90 tracking-wide leading-relaxed mb-4">{children}</p>,
    },
    list: {
        bullet: ({ children }) => <ul className="space-y-3 mt-3 mb-6">{children}</ul>,
        number: ({ children }) => <ol className="space-y-3 mt-3 mb-6 list-decimal pl-6">{children}</ol>,
    },
    listItem: {
        bullet: ({ children }) => (
            <li className="flex gap-3">
                <span className="mt-[0.55rem] h-[4px] w-[4px] rounded-full bg-delft/60 shrink-0" />
                <span className="text-delft/90 tracking-wide leading-relaxed">{children}</span>
            </li>
        ),
        number: ({ children }) => <li className="text-delft/90 tracking-wide leading-relaxed">{children}</li>,
    },
    marks: {
        strong: ({ children }) => <strong className="font-semibold text-delft">{children}</strong>,
        em: ({ children }) => <em className="italic">{children}</em>,
        link: ({ value, children }) => {
            const href = value?.href;
            const blank = !!value?.blank;
            if (!href) return children;
            return (
                <a
                    href={href}
                    target={blank ? "_blank" : undefined}
                    rel={blank ? "noreferrer" : undefined}
                    className="underline underline-offset-4 hover:opacity-80 transition"
                >
                    {children}
                </a>
            );
        },
    },
};

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
    const data = await sanityClient.fetch(singleJobQuery, { slug: params.slug });

    if (!data?.job) {
        return { notFound: true, revalidate: 60 };
    }

    return {
        props: { job: data.job }, // <- jetzt nur das job-Objekt übergeben
        revalidate: 60,
    };
}

export default function JobDetailPage({ job }) {
    if (!job) return null;

    const heroImage = job.image || job?.seo?.ogImage;

    const title = job?.seo?.title || job.title || "Offene Stelle";
    const description =
        job?.seo?.description || job.teaser || "Informieren Sie sich über die Details dieser offenen Stelle.";

    return (
        <>
            <Head>
                <title>{title}</title>
                {description ? <meta name="description" content={description} /> : null}

                <meta property="og:title" content={title} />
                {description ? <meta property="og:description" content={description} /> : null}
            </Head>

            <DetailHero title={job.title} subtitle={job.teaser} image={heroImage} />
            <InfoBar />

            {/* Detail Content */}
            <section className="bg-primary-50 py-10 md:py-14">
                <div className="mx-auto max-w-6xl px-4 md:px-6 lg:px-8">
                    {Array.isArray(job.detailContent) ? (
                        <PortableText value={job.detailContent} components={ptComponents} />
                    ) : null}
                </div>
            </section>

            <JobApplyCTASection
                title="Jetzt bewerben"
                text={`Interesse an der Position "${job.title}"? Bewerben Sie sich unkompliziert und lernen Sie unser Team kennen.`}
                jobSlug={job.slug}
            />
        </>
    );
}
