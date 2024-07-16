/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        myColor: {
          50: '#1B1717',
          100: '#5A5A5B',
          150: '#0D0D0D',
          200: '#181717',
          250: '#2B2525',
          300: '#5E5C5E',
          350: '#565656',
          400: '#D02AF6',
          450: '#767373',
          500: '#11E0AB',
          600: '#F5C97A',
          700: '#E3AC52',
          750: '#0E0E0D'
        },
      },
      fontFamily: {
        'Montserrat': ['Montserrat', 'sans-serif'],
      },
      animation: {
        'spin-slow': 'spin 6s linear infinite',
      },
      backgroundImage: {
        'gray-gradient': "linear-gradient(90deg, #00FFBE 0%, #D000FF 100%)",
      }
    },
  },
  plugins: [],
}
