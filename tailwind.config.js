/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontSize: {
        '2xs': ['0.8125rem', { lineHeight: '1.15rem' }], // ~14.3px en 1366, 16.2px en 1920 (mínimo >= 14px)
        xs: ['0.875rem', { lineHeight: '1.25rem' }],     // ~15.4px en 1366, 17.5px en 1920
        sm: ['1rem', { lineHeight: '1.45rem' }],         // ~17.6px en 1366, 20px en 1920
        base: ['1.125rem', { lineHeight: '1.65rem' }],   // ~19.8px en 1366, 22.5px en 1920
        lg: ['1.25rem', { lineHeight: '1.75rem' }],      // ~22px en 1366, 25px en 1920
        xl: ['1.45rem', { lineHeight: '1.9rem' }],       // ~25.5px en 1366, 29px en 1920
        '2xl': ['1.8rem', { lineHeight: '2.2rem' }],
        '3xl': ['2.25rem', { lineHeight: '2.6rem' }],
        '4xl': ['2.8rem', { lineHeight: '3.1rem' }],
      },
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
