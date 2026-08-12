/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#EEF3FD",
          100: "#BDCEF8",
          500: "#1B5FE8",
          700: "#1B3A6B",
          900: "#0F1C36",
        },
      },
      fontFamily: {
        sans: ["Plus Jakarta Sans", "sans-serif"],
      },
      boxShadow: {
        card: "0 1px 3px rgba(15,23,41,0.07), 0 1px 8px rgba(15,23,41,0.04)",
      },
    },
  },
  plugins: [],
};
