// utils/hyphenateTitle.js

// Hilfstabelle: Original -> Version mit Soft Hyphen (\u00AD)
const CUSTOM_HYPHENATION_MAP = {
    Kinderbehandlung: `Kinder\u00ADbehandlung`,
    Zahnerhaltung: `Zahn\u00ADerhaltung`,
    Zahnaesthetik: `Zahn\u00ADästhetik`, // falls du ae → ä mappst, anpassen
    Zahnästhetik: `Zahn\u00ADästhetik`,
    Parodontologie: `Parodon\u00ADtologie`,
    Implantologie: `Implan\u00ADtologie`,
    Prophylaxe: `Prophy\u00ADlaxe`,
    // hier einfach weitere Begriffe ergänzen …
};

/**
 * Fügt für bekannte lange Wörter weiche Trennstellen ein.
 * Die Trennstellen werden nur genutzt, wenn ein Zeilenumbruch nötig ist.
 */
export function hyphenateTitle(title) {
    if (!title) return "";
    const trimmed = title.trim();

    // 1. exakte Matches: ganzer Titel ist ein Wort
    if (CUSTOM_HYPHENATION_MAP[trimmed]) {
        return CUSTOM_HYPHENATION_MAP[trimmed];
    }

    // 2. innerhalb eines längeren Titels ersetzen (z. B. "Kinderbehandlung & Prophylaxe")
    let result = trimmed;
    Object.entries(CUSTOM_HYPHENATION_MAP).forEach(([original, hyphenated]) => {
        if (result.includes(original)) {
            result = result.replaceAll(original, hyphenated);
        }
    });

    return result;
}
