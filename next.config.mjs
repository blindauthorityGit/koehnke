/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,

    images: {
        domains: ["cdn.sanity.io", "api.maptiler.com"], // Sanity-Bildquelle erlauben
    },
};

export default nextConfig;
