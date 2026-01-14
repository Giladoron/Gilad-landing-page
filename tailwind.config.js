/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        accent: "#FF6B35",
        brandDark: "#0A0A0A",
        brandGray: "#1A1A1A",
      },
      fontFamily: {
        sans: ["Heebo", "sans-serif"],
        heading: ["Montserrat", "Heebo", "sans-serif"],
      },
    },
  },
  plugins: [],
};
