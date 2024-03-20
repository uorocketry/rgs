import { defineConfig } from "vitepress";

export default defineConfig({
    base: "/rgs/",
    ignoreDeadLinks: true,
    title: "RGS Docs",
    description: "RGS Documentation",
    themeConfig: {
        search: {
            provider: "local",
        },
        lastUpdated: {},
        logo: "static/icon_bg.png",
        editLink: {
            pattern: "https://github.com/uorocketry/rgs/edit/main/docs/:path",
        },

        nav: [
            { text: "Home", link: "/" },
            { text: "Guide", link: "/guide/" },
            { text: "Hydra Provider", link: "/hydra-provider/" },
            { text: "Web", link: "/web/" },
        ],

        sidebar: {
            "/guide/": [
                {
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
                    text: "Hand's On",
                    items: [
                        {
                            text: "Altitude Widget",
                            link: "/guide/hands-on/altitude-widget",
                        },
                        {
                            text: "Modifying the database",
                            link: "/guide/hands-on/modifying-the-database",
                        },
                    ],
                },
            ],
        },

        socialLinks: [
            { icon: "github", link: "https://github.com/uorocketry/rgs" },
        ],
    },
});
