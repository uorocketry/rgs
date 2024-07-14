import { defineConfig } from "astro/config";
import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";
import tailwind from "@astrojs/tailwind";
import lit from "@astrojs/lit";

// https://astro.build/config
export default defineConfig({
    integrations: [
        mdx(),
        sitemap(),
        tailwind({
            applyBaseStyles: true,
        }),
        lit(),
    ],
});
