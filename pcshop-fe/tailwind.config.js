/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#ffffff", // White
        surface: "#f4f4f5", // Light gray for sections
        primary: "#000000", // Black for main branding/buttons
        "primary-hover": "#27272a", // Dark gray hover
        secondary: "#3f3f46", // Gray
        accent: "#dc2626", // Red for prices/hot items
        text: "#000000", // Black text
        "text-muted": "#52525b", // Gray text
        border: "#e4e4e7", // Light border
      },
      fontFamily: {
        sans: ["Be Vietnam Pro", "Inter", "sans-serif"],
      },
      boxShadow: {
        'card': '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
        'card-hover': '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
      }
    },
  },
  plugins: [],
}
