/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        bakery: {
          pink: {
            light: '#ffe4ea',
            DEFAULT: '#f472b6',
            dark: '#be185d',
            vibrant: '#ec4899',
          },
          cream: {
            light: '#fffdfa',
            DEFAULT: '#fff7ed',
            dark: '#fed7aa',
          },
          choco: {
            light: '#78350f',
            DEFAULT: '#451a03',
            dark: '#260e02',
          },
          gold: {
            light: '#fef08a',
            DEFAULT: '#eab308',
            dark: '#ca8a04',
          },
          mint: {
            DEFAULT: '#6ee7b7',
            dark: '#059669',
          }
        },
      },
      fontFamily: {
        sans: ['var(--font-outfit)', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
