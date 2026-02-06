/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./src/**/*.{html,js,ts,jsx,tsx}",
        "./media/**/*.{html,js,ts,jsx,tsx}"
    ],
    theme: {
        extend: {
            colors: {
                kadence: {
                    light: '#4facfe',
                    DEFAULT: '#00f2fe',
                    dark: '#1a1a2e'
                }
            }
        },
    },
    plugins: [],
}
