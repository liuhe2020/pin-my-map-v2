/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#ed6c02',
        primaryDark: '#ea580c',
        secondary: '#212121',
        dark: '#404040',
      },
      screens: {
        xs: '480px',
      },
    },
  },
  plugins: [],
};
