export default function ContactMapEmbed({ lat, lng, zoom = 16 }) {
    if (lat == null || lng == null) return null;

    const mapId = process.env.NEXT_PUBLIC_MAPTILER_MAP_ID;
    const key = process.env.NEXT_PUBLIC_MAPTILER_TOKEN;

    const src = `https://api.maptiler.com/maps/${mapId}/?key=${key}#${zoom}/${lat}/${lng}`;

    return (
        <div className="relative mx-auto w-full max-w-[640px] aspect-square rounded-full overflow-hidden">
            {/* Map */}
            <iframe
                title="Anfahrtskarte"
                src={src}
                className="absolute inset-0 h-full w-full border-0"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                tabIndex={-1} // kein Fokus
                aria-hidden="true" // Screenreader ignorieren
            />

            {/* Custom Marker (zentriert) */}
            <div className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-full">
                <div className="absolute left-1/2 top-[22px] h-10 w-10 -translate-x-1/2 rounded-full bg-[#2ecc71]/25 blur-md" />
                <svg width="44" height="44" viewBox="0 0 24 24" className="relative drop-shadow-sm">
                    <path d="M12 22s7-4.5 7-11a7 7 0 1 0-14 0c0 6.5 7 11 7 11z" fill="#2ecc71" />
                    <circle cx="12" cy="11" r="2.6" fill="white" />
                </svg>
            </div>

            {/* 🔒 Interaktions-Blocker */}
            <div
                className="absolute inset-0 z-10"
                aria-hidden
                // fängt ALLES ab: Maus, Touch, Scroll, Pinch
                onWheel={(e) => e.preventDefault()}
                onTouchMove={(e) => e.preventDefault()}
                onMouseDown={(e) => e.preventDefault()}
                onPointerDown={(e) => e.preventDefault()}
            />
        </div>
    );
}
