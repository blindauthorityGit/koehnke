export function slugifyFromTitle(title = "") {
    return (
        title
            .toLowerCase()
            .trim()
            // deutsche Umlaute
            .replace(/ä/g, "ae")
            .replace(/ö/g, "oe")
            .replace(/ü/g, "ue")
            .replace(/ß/g, "ss")
            // alles was kein buchstabe oder zahl ist → underscore
            .replace(/[^a-z0-9]+/g, "_")
            // mehrfach-underscore zusammenfassen
            .replace(/_+/g, "_")
            // führende / abschließende underscores entfernen
            .replace(/^_|_$/g, "")
    );
}
