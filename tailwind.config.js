/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          white: '#ffffff',
          offwhite: '#fafafa',
          charcoal: '#111111',
          gray: '#f3f4f6',
          amber: '#f59e0b',
        }
      }
    },
  },
  plugins: [],
}
