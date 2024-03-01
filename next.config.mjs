/* eslint-disable @typescript-eslint/require-await */
/**
 * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. This is especially useful
 * for Docker builds.
 */
await import("./src/env.mjs");

/** @type {import("next").NextConfig} */
const config = {
	images: {
		remotePatterns: [
			{
				protocol: "https",
				hostname: "img.clerk.com",
				port: "",
				pathname: "/*",
			},
			{
				protocol: "https",
				hostname: "ujxc2e33aswtcpny.public.blob.vercel-storage.com",
				port: "",
				pathname: "/**",
			},
			{
				protocol: "https",
				hostname: "utfs.io",
				port: "",
				pathname: "/**",
			}
		],
	},
	experimental: {
		instrumentationHook: true,
	}
};

export default config;
