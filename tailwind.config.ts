import { type Config } from "tailwindcss";
import { fontFamily } from "tailwindcss/defaultTheme";

export default {
  content: ["./src/**/*.tsx"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-sans)", ...fontFamily.sans],
      },
      colors: {
        main: "#15162c",
        text: "#f5f5f5",
        hot: "hsl(280,100%,70%)",
      },
    },
  },
  plugins: [],
} satisfies Config;
