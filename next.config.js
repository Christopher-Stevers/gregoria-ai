/**
 * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. This is especially useful
 * for Docker builds.
 */
await import("./src/env.js");

/** @type {import("next").NextConfig} */
const config = {
    reactStrictMode: true,
    images: {
        domains: ["cdn.discordapp.com"],
    },
    async headers() {
        return [
        {
            source: "/(.*)",
            headers: [
            {
                key: "X-Frame-Options",
                value: "SAMEORIGIN",
            },
            ],
        },
        ];
    },
};

export default config;
