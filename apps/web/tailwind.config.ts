import type { Config } from "tailwindcss";
import daisyui from "daisyui";

const config: Config = {
  content: ["index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Fira Sans"', "ui-sans-serif", "system-ui"],
        display: ['"Playfair Display"', "ui-serif", "Georgia", "serif"],
      },
      backgroundImage: {
        "felt-gradient":
          "radial-gradient(circle at 20% 20%, rgba(34, 116, 69, 0.4), transparent 55%), radial-gradient(circle at 80% 30%, rgba(20, 83, 45, 0.35), transparent 45%), radial-gradient(circle at 50% 80%, rgba(15, 56, 31, 0.4), transparent 50%)",
      },
    },
  },
  plugins: [daisyui],
  daisyui: {
    themes: [
      {
        tablefelt: {
          primary: "#1f6f37",
          "primary-content": "#fdf8ef",
          secondary: "#18492a",
          "secondary-content": "#f4efe2",
          accent: "#d4af37",
          "accent-content": "#231a0a",
          neutral: "#0a2415",
          "neutral-content": "#fdf8ef",
          "base-100": "#0f381f",
          "base-200": "#14532d",
          "base-300": "#1f6f37",
          "base-content": "#fdf8ef",
          info: "#4abbb5",
          success: "#2f855a",
          warning: "#d9983d",
          error: "#d9534f",
        },
      },
      "light",
      "dark",
      "forest",
    ],
  },
};

export default config;
