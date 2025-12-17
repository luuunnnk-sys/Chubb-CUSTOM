/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                chubb: {
                    red: '#c8102e',
                    'red-dark': '#a00d24',
                    green: '#22c55e',
                    blue: '#3b82f6',
                }
            }
        },
    },
    plugins: [],
}
