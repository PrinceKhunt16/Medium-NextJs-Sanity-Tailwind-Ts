/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        notosans: ["noto-sans", "Noto Sans JP, sans-serif"],
      },
    },
  },
  plugins: [],
}
