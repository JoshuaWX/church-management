/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // RCCG-inspired palette: deep royal blue as primary, warm red accent, gold highlights
        primary: {
          50:  '#eef2ff',
          100: '#dce4ff',
          200: '#b9c9ff',
          300: '#8ba6ff',
          400: '#5c7cff',
          500: '#1e3a8a', // Royal blue — main brand
          600: '#1a3278',
          700: '#152a66',
          800: '#112254',
          900: '#0c1a42',
        },
        accent: {
          50:  '#fef7ed',
          100: '#fdecd3',
          200: '#fad5a5',
          300: '#f5b76d',
          400: '#e89832',
          500: '#d4810f', // Warm gold
          600: '#b86d0a',
          700: '#9a560b',
          800: '#7d4510',
          900: '#673a12',
        },
        wine: {
          50:  '#fdf2f3',
          100: '#fce7e9',
          200: '#f9d0d5',
          300: '#f3aab3',
          400: '#ea7a89',
          500: '#b91c30', // RCCG red — for accents / CTAs
          600: '#a31829',
          700: '#891323',
          800: '#721220',
          900: '#62131f',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
