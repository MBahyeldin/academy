import type { Config } from "tailwindcss";
import { academyTheme } from "@academy/design-tokens/tailwind";

export default {
  content: [
    "./index.html",
    "./src/**/*.{ts,tsx}",
    "../../packages/ui/src/**/*.{ts,tsx}",
  ],
  theme: academyTheme,
  plugins: [],
} satisfies Config;
