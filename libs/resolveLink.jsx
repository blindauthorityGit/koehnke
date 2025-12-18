// libs/resolveLink.js
export function resolveLinkToHref(link) {
    if (!link) return "#";
    if (link.type === "external") return link.external || "#";

    // internal: du kannst hier später auf echte Slugs/Routen erweitern
    const t = link?.internal?._type;

    const map = {
        startPage: "/",
        servicesPage: "/leistungen",
        praxisPage: "/praxis",
        teamPage: "/team",
        patientServicesPage: "/service", // oder "/patienten-services" – je nachdem wie du routest
    };

    return map[t] || "/";
}
