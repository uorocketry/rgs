import { join } from "path";

const config = {
    darkMode: "class",
    content: ["./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}"],
    plugins: [require("@tailwindcss/typography")],
};

export default config;
