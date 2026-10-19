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
        // Design System Palette
        primary: {
          light: '#f472b6',
          DEFAULT: '#ec4899',          // fucsia
          dark: '#be185d',
        },
        secondary: {
          light: '#c084fc',
          DEFAULT: '#a78bfa',        // lila
          dark: '#7e22ce',
        },
        accent: {
          light: '#93c5fd',
          DEFAULT: '#60a5fa',           // celeste caramelo
          dark: '#2563eb',
        },
        warning: {
          light: '#fef08a',
          DEFAULT: '#fbbf24',          // amarillo manteca
          dark: '#d97706',
        },
        background: '#fffbf5',       // crema/blanco
        text: '#451a03',            // marrón chocolate para textos y contrastes
        chocolate: {
          light: '#78350f',
          DEFAULT: '#451a03',
          dark: '#260e02',
        },
        success: '#22c55e',          // verde éxito
        error: '#ef4444',            // rojo error
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
      borderRadius: {
        // 16px para tarjetas, 999px para botones y chips
        card: '16px',
        button: '999px',
        chip: '999px',
      },
      boxShadow: {
        // Sombra inferior sólida para botones, sombra suave para tarjetas
        button: '0 4px 0 rgba(236,72,153,0.6)', // fucsia shadow
        card: '0 2px 8px rgba(0,0,0,0.1)',
        modal: '0 10px 30px rgba(0,0,0,0.25)',
      },
      transitionDuration: {
        DEFAULT: '200ms',
      },
      animation: {
        'modal-enter': 'modalEnter 0.25s ease-out forwards',
      },
      keyframes: {
        modalEnter: {
          '0%': { opacity: '0', transform: 'scale(0.9)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
      },
      fontFamily: {
        // Título grueso y cuerpo ligero
        title: ['var(--font-outfit)', 'sans-serif'],
        body: ['var(--font-outfit)', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
