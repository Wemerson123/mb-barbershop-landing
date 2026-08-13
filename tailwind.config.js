/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        // MB Barbershop brand maroon, taken from the live site's theme-color.
        maroon: {
          DEFAULT: '#800000',
          50: '#fdf3f3',
          100: '#fbe5e5',
          400: '#b31b1b',
          500: '#9a0f0f',
          600: '#800000',
          700: '#6b0000',
          900: '#3d0000',
        },
        bone: '#f5f2ed',
        // Warm brass, matched to the gold neon sign and chair in the shop.
        gold: {
          DEFAULT: '#c9a44c',
          300: '#e3c684',
          400: '#d4b263',
          600: '#a8863a',
        },
      },
      keyframes: {
        marquee: {
          from: { transform: 'translateX(0)' },
          to: { transform: 'translateX(-50%)' },
        },
        'rise-in': {
          from: { opacity: '0', transform: 'translateY(18px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        // Opening title card. The MB mark strikes on like neon warming up,
        // then the two panels part and lift away to the hero.
        'intro-strike': {
          '0%': { opacity: '0', transform: 'scale(1.14)', filter: 'blur(14px)' },
          '45%': { opacity: '1', transform: 'scale(1)', filter: 'blur(0)' },
          '52%': { opacity: '0.72' },
          '60%': { opacity: '1' },
          '100%': { opacity: '1', transform: 'scale(1)', filter: 'blur(0)' },
        },
        'intro-rule': {
          '0%, 30%': { transform: 'scaleX(0)', opacity: '0' },
          '100%': { transform: 'scaleX(1)', opacity: '1' },
        },
        'intro-track': {
          '0%, 25%': { opacity: '0', letterSpacing: '0.8em' },
          '100%': { opacity: '1', letterSpacing: '0.4em' },
        },
        'intro-sub': {
          '0%, 55%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        'intro-lift-top': {
          from: { transform: 'translateY(0)' },
          to: { transform: 'translateY(-100%)' },
        },
        'intro-lift-bottom': {
          from: { transform: 'translateY(0)' },
          to: { transform: 'translateY(100%)' },
        },
        'intro-logo-out': {
          from: { opacity: '1', transform: 'scale(1)' },
          to: { opacity: '0', transform: 'scale(0.94)' },
        },
      },
      animation: {
        marquee: 'marquee 32s linear infinite',
        'rise-in': 'rise-in 0.8s cubic-bezier(0.22, 1, 0.36, 1) both',
        'intro-strike': 'intro-strike 1.5s cubic-bezier(0.22, 1, 0.36, 1) both',
        'intro-rule': 'intro-rule 1.2s cubic-bezier(0.22, 1, 0.36, 1) both',
        'intro-track': 'intro-track 1.5s cubic-bezier(0.22, 1, 0.36, 1) both',
        'intro-sub': 'intro-sub 1.6s ease-out both',
        'intro-lift-top': 'intro-lift-top 0.9s cubic-bezier(0.76, 0, 0.24, 1) forwards',
        'intro-lift-bottom': 'intro-lift-bottom 0.9s cubic-bezier(0.76, 0, 0.24, 1) forwards',
        'intro-logo-out': 'intro-logo-out 0.45s ease-in forwards',
      },
    },
  },
  plugins: [],
};
