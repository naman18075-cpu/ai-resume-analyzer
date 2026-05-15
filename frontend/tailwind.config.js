/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      fontFamily: {
        display: ["Space Grotesk", "sans-serif"],
        sans: ["Plus Jakarta Sans", "sans-serif"],
      },
      colors: {
        ink: "#06131e",
        mist: "#eef6ff",
        slate: {
          950: "#07111d",
        },
        brand: {
          50: "#eefbff",
          100: "#d7f5ff",
          200: "#afe9ff",
          300: "#77d9ff",
          400: "#32bfff",
          500: "#0b95d1",
          600: "#0c79ab",
          700: "#115f86",
          800: "#154f6d",
          900: "#183f58",
        },
        lime: {
          400: "#9ae66e",
        },
      },
      boxShadow: {
        panel: "0 20px 70px rgba(6, 19, 30, 0.12)",
      },
      backgroundImage: {
        "hero-glow":
          "radial-gradient(circle at top left, rgba(50, 191, 255, 0.28), transparent 40%), radial-gradient(circle at top right, rgba(154, 230, 110, 0.2), transparent 35%)",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-10px)" },
        },
      },
      animation: {
        float: "float 6s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};
