import { defineConfig } from "vitepress";

// .vitepress/config.js
import { withMermaid } from "vitepress-plugin-mermaid";

// export default withMermaid({
//     // your existing vitepress config...
//     // optionally, you can pass MermaidConfig
//     mermaid: {
//         // refer https://mermaid.js.org/config/setup/modules/mermaidAPI.html#mermaidapi-configuration-defaults for options
//     },
//     // optionally set additional config for plugin itself with MermaidPluginConfig
//     mermaidPlugin: {
//         class: "mermaid my-class", // set additional css classes for parent container
//     },
// });

// https://vitepress.dev/reference/site-config
export default defineConfig({
    title: "RGS Docs",
    description: "RGS Documentation",
    themeConfig: {
        logo: "static/icon_bg.png",

        // https://vitepress.dev/reference/default-theme-config
        nav: [
            { text: "Home", link: "/" },
            { text: "Guide", link: "/guide/" },
            { text: "Hydra Provider", link: "/hydra-provider/" },
            { text: "Web", link: "/web/" },
        ],

        sidebar: [
            {
                text: "Guide",
                items: [
                    { text: "Getting Started", link: "/guide/" },
                    {
                        text: "Requirements",
                        link: "/guide/requirements/",
                        items: [
                            {
                                text: "Development Environment",
                                link: "/guide/requirements/development-environment",
                            },
                            {
                                text: "Docker",
                                link: "/guide/requirements/docker",
                            },
                            {
                                text: "Node",
                                link: "/guide/requirements/node",
                            },
                            {
                                text: "Protobuf",
                                link: "/guide/requirements/protobuf",
                            },
                            {
                                text: "Rust",
                                link: "/guide/requirements/rust",
                            },
                        ],
                    },
                    { text: "Next Steps", link: "/guide/next-steps" },
                ],
            },

            {
                text: "Examples",
                items: [
                    {
                        text: "Markdown Examples",
                        link: "/markdown-examples",
                    },
                    { text: "Runtime API Examples", link: "/api-examples" },
                ],
            },
        ],

        socialLinks: [
            { icon: "github", link: "https://github.com/vuejs/vitepress" },
        ],
    },
});
