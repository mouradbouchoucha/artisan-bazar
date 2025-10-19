/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#8B5FBF',
        secondary: '#FF9A56',
        'primary-dark': '#7A4FA8',
        'secondary-dark': '#E88A45',
      }
    },
  },
  plugins: [],
}

