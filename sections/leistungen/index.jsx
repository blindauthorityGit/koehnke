// components/leistungen/LeistungenSection.jsx

import LeistungCard from "@/components/leistungen/leistungCard";

import ZahnerhaltungIcon from "@/assets/icons/zahnerhaltung.svg";
import ZahnersatzIcon from "@/assets/icons/zahnersatz.svg";
import ProphylaxeIcon from "@/assets/icons/prophylaxe.svg";
import ImplantologieIcon from "@/assets/icons/implantologie.svg";
import ChirurgieIcon from "@/assets/icons/chirurgie.svg";
import ZahnaesthetikIcon from "@/assets/icons/zahnaesthetik.svg";
import KinderbehandlungIcon from "@/assets/icons/kinderbehandlung.svg";
import AngstpatientenIcon from "@/assets/icons/angstpatienten.svg";
import ParodontologieIcon from "@/assets/icons/parodontologie.svg";
import EndodontieIcon from "@/assets/icons/endodontie.svg";

import { H2 } from "@/typography/headlines";

// Mapping: slug -> Icon
const ICONS_BY_SLUG = {
    zahnerhaltung: ZahnerhaltungIcon,
    zahnersatz: ZahnersatzIcon,
    prophylaxe: ProphylaxeIcon,
    implantologie: ImplantologieIcon,
    chirurgie: ChirurgieIcon,
    zahnaesthetik: ZahnaesthetikIcon,
    kinderbehandlung: KinderbehandlungIcon,
    angstpatienten: AngstpatientenIcon,
    parodontologie: ParodontologieIcon,
    endodontie: EndodontieIcon,
};

export default function LeistungenSection({ services = [], currentSlug = "", headline = "Unsere Leistungen" }) {
    // services sortieren
    const orderedServices = [...services].sort((a, b) => {
        const aOrder = typeof a.order === "number" ? a.order : 999;
        const bOrder = typeof b.order === "number" ? b.order : 999;
        return aOrder - bOrder;
    });

    return (
        <section className="relative bg-primary-50/60 py-20">
            <div className="mx-auto container rounded-[40px] bg-white/80 p-10 shadow-xl shadow-primary-900/5 md:p-14">
                <div className="mb-10 text-center">
                    <H2 className="text-3xl font-semibold text-primary-900 md:text-4xl">{headline}</H2>
                </div>

                <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                    {orderedServices.map((service) => {
                        const slug = service.slug?.current || service.slug || "";

                        // **aktuellen Service ausblenden**
                        if (slug === currentSlug) return null;

                        const Icon = ICONS_BY_SLUG[slug];

                        return (
                            <LeistungCard
                                key={service._id}
                                title={service.title}
                                slug={slug}
                                description={service.teaser?.split(".")[0] || ""}
                                iconSrc={Icon || null}
                            />
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
