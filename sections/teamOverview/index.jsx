import TeamMember from "@/components/team/card";
import WaveSection from "@/components/layout/waveSections";
import { H2 } from "@/typography/headlines";
import { urlFor } from "@/function/urlFor";

export default function TeamSection({ members = [] }) {
    return (
        <WaveSection id="team">
            <div className="mx-auto max-w-7xl px-4 md:px-6 lg:px-8">
                {/* Headline */}
                <div className="mb-16 text-center">
                    <H2 className="text-3xl md:text-4xl text-primary-900">Unser Team</H2>
                </div>

                {/* Team Grid / Flex */}
                <div
                    className="
                        flex flex-col items-center gap-14
                        sm:grid sm:grid-cols-2 sm:gap-14
                        lg:flex lg:flex-row lg:justify-between lg:items-start lg:gap-0
                    "
                >
                    {members.map((member) => {
                        const imgUrl = member?.image ? urlFor(member.image).width(800).url() : null;

                        const alt = member?.image?.isDecorative
                            ? ""
                            : member?.image?.alt || member?.title || "Teammitglied";

                        return (
                            <div
                                key={member._id}
                                className="
                                    flex justify-center
                                    lg:flex-1
                                "
                            >
                                <TeamMember
                                    photo={imgUrl}
                                    name={member.title}
                                    role={member.subtitle}
                                    teaser={member.teaser}
                                    alt={alt}
                                    size="large"
                                />
                            </div>
                        );
                    })}
                </div>
            </div>
        </WaveSection>
    );
}
