// tailwind.config.js
module.exports = {
    content: [
      "./app/**/*.{js,ts,jsx,tsx}",
      "./pages/**/*.{js,ts,jsx,tsx}",
      "./components/**/*.{js,ts,jsx,tsx}",
    ],
    darkMode: "class", // Enable dark mode with the "dark" class
    theme: {
      extend: {
        fontFamily: {
          sans: ["var(--font-sans)"],
        },
      },
    },
    plugins: [],
  };