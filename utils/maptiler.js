export function buildMapTilerStaticUrl({ lat, lng, zoom = 16, size = 1200 }) {
    const token = process.env.NEXT_PUBLIC_MAPTILER_TOKEN;
    const mapId = process.env.NEXT_PUBLIC_MAPTILER_MAP_ID; // <-- deine Cloud Map ID

    if (!token || !mapId || !lat || !lng) return null;

    // MapTiler Static Maps: /maps/{MAP_ID}/static/{lon},{lat},{zoom}/{w}x{h}.png
    // Marker via query
    return `https://api.maptiler.com/maps/${mapId}/static/${lng},${lat},${zoom}/${size}x${size}.png?key=${token}&markers=${lng},${lat},#2ecc71`;
}
