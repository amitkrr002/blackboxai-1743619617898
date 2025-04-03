/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        dark: {
          background: '#1a202c',
          text: '#f7fafc',
          card: '#2d3748',
        },
      },
    },
  },
  plugins: [],
};
