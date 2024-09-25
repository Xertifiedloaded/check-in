/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        lightGray: "rgb(107 114 128 / 1)",
      },
      backgroundColor: {
        goldenYellow: "rgb(255 206 81 / 1)",
        bgColorRed: "#F00",
      },
    },
  },
  plugins: [],
}
