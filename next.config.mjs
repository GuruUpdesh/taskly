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
				pathname: "/**",
			},
			{
				protocol: "https",
				hostname: "mubcao7zfz2oohlb.public.blob.vercel-storage.com",
				port: "",
				pathname: "/**",
			},
			{
				protocol: "https",
				hostname: "avatars.githubusercontent.com",
				port: "",
				pathname: "/**",
			},
		],
	},
	devIndicators: {
		buildActivityPosition: "bottom-right",
	},
	experimental: {
		instrumentationHook: true,
		serverComponentsExternalPackages: ["pino", "pino-pretty"],
	},
	// resolves client-side module resolution error
	// @see https://github.com/pinojs/pino/issues/1841#issuecomment-2244564289
	webpack: (config, context) => {
		// eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
		config.externals.push({
			"thread-stream": "commonjs thread-stream",
		});
		// eslint-disable-next-line @typescript-eslint/no-unsafe-return
		return config;
	},
};

export default config;
