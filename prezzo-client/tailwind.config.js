/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ['./src/**/*.{js,jsx,ts,tsx}'],
    theme: {
        extend: {
            'lineHeight': {
                '12': '3rem',
                '15': '3.75rem',
                '18': '4.5rem',
            }
        },
    },
    plugins: [],
}
