/** @type {import('tailwindcss').Config} */
export default {
  // Note: _meta/ folder is gitignored and excluded from build
  // It only contains .md files, so it won't match the content patterns below
  content: ["./index.html", "./**/*.{jsx,tsx}", "./**/*.css"],
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
      screens: {
        // Add tablet/laptop breakpoint for better 15.6" laptop support
        // Default: mobile (0px+)
        // md: 768px (tablets/small laptops) - Tailwind default
        // lg: 1024px (laptops/desktops) - Tailwind default
        // Ensure md breakpoint works well for 15.6" laptops (typically 1366px or 1920px width)
        // Most 15.6" laptops are >= 1024px, so they should use lg: breakpoint
      },
    },
  },
  plugins: [],
};
