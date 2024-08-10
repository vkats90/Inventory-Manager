/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        Roboto: ['Roboto'],
        Ubuntu: ['Ubuntu'],
      },
      colors: {
        primary: '#FF593F',
      },
    },
  },
  plugins: [],
}
