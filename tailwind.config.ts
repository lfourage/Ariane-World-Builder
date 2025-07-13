import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}", // ou ./src/ selon ton projet
  ],
  theme: {
    extend: {
      colors: {
        primary: "#ff0055", // ta palette custom ici
      },
      fontFamily: {
        sans: ["Inter", "sans-serif"], // police par défaut
      },
    },
  }
};

export default config;
