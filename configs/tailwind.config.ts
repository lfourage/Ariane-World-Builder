import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#ff0055",
      },
      fontFamily: {
        sans: ["Inter", "sans-serif"],
      },
    },
  }
};

export default config;
