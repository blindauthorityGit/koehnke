/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./pages/**/*.{js,jsx,ts,tsx}",
        "./components/**/*.{js,jsx,ts,tsx}",
        "./sections/**/*.{js,jsx,ts,tsx}",
        "./app/**/*.{js,jsx,ts,tsx}",
    ],
    theme: {
        // globale container-Einstellung
        container: {
            center: true,
            padding: {
                DEFAULT: "1.25rem", // ~20px
                sm: "1.5rem",
                lg: "2rem",
            },
            // >>> HIER machen wir dein "Laptop-Breakpoint"
            // Diese Werte sind die MAX-BREITEN DES CONTAINERS,
            // nicht die Viewport-Breite.
            screens: {
                sm: "600px",
                md: "728px",
                lg: "960px",

                // alles um 1366px Viewport → Container ~1120px breit
                xl: "1120px",

                // große Desktops
                "2xl": "1220px",
                "3xl": "1441px",
            },
        },
        extend: {
            // deine Fonts/Farben kannst du hier später reinziehen,
            // im Moment reicht uns aber der Container.
        },
    },
    plugins: [],
};
