/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        gold: "#D4AF37",
        green: "#1B5E3C",
        kblack: "#0A0A0A",
        kcard: "#151512",
      },
    },
  },
  plugins: [],
};
