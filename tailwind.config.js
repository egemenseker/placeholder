/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        honeyYellow: '#FFD700',
        warmAmber: '#FFBF00',
        darkAmber: '#CC9900',
        softBlack: '#2D2D2D',
        lightCream: '#FFFEF7',
        creamWhite: '#FAF9F2',
        beeOrange: '#FF8C00',
      },
      animation: {
        'slide-infinite': 'slide-infinite 30s linear infinite',
      },
      keyframes: {
        'slide-infinite': {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-75%)' },
        },
      },
    },
  },
  plugins: [],
};
