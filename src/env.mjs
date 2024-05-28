import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
	/**
	 * Specify your server-side environment variables schema here. This way you can ensure the app
	 * isn't built with invalid env vars.
	 */
	server: {
		DATABASE_URL: z
			.string()
			.url()
			.refine(
				(str) => !str.includes("YOUR_MYSQL_URL_HERE"),
				"You forgot to change the default URL",
			),
		NODE_ENV: z
			.enum(["development", "test", "production"])
			.default("development"),
		OPENAI_API_KEY: z.string(),
		RESEND_API_KEY: z.string(),
		CRON_SECRET: z.string(),
		CLERK_SECRET_KEY: z.string(),
		CLERK_PROD_SECRET_KEY: z.string().optional(),
		CLERK_WEBHOOK_SECRET: z.string(),
		KV_URL: z.string(),
		KV_REST_API_URL: z.string(),
		KV_REST_API_TOKEN: z.string(),
		KV_REST_API_READ_ONLY_TOKEN: z.string(),
		UPLOADTHING_SECRET: z.string(),
		UPLOADTHING_APP_ID: z.string(),
		ACCESS_TOKEN: z.string(),
		BLOB_READ_WRITE_TOKEN: z.string(),
		GH_WEBHOOK_SECRET: z.string(),
		GH_CLIENT_SECRET: z.string(),
		GH_APP_PRIVATE_KEY_BASE_64: z.string(),
		TESTING: z.boolean().default(false),
	},

	/**
	 * Specify your client-side environment variables schema here. This way you can ensure the app
	 * isn't built with invalid env vars. To expose them to the client, prefix them with
	 * `NEXT_PUBLIC_`.
	 */
	client: {
		NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: z.string(),
		NEXT_PUBLIC_NODE_ENV: z
			.enum(["development", "test", "production"])
			.default("development"),
		NEXT_PUBLIC_VERCEL_URL: z.string(),
	},

	/**
	 * You can't destruct `process.env` as a regular object in the Next.js edge runtimes (e.g.
	 * middlewares) or client-side so we need to destruct manually.
	 */
	runtimeEnv: {
		DATABASE_URL: process.env.DATABASE_URL,
		NODE_ENV: process.env.NODE_ENV,
		OPENAI_API_KEY: process.env.OPENAI_API_KEY,
		RESEND_API_KEY: process.env.RESEND_API_KEY,
		CRON_SECRET: process.env.CRON_SECRET,
		CLERK_SECRET_KEY: process.env.CLERK_SECRET_KEY,
		CLERK_PROD_SECRET_KEY: process.env.CLERK_PROD_SECRET_KEY,
		NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY:
			process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY,
		CLERK_WEBHOOK_SECRET: process.env.CLERK_WEBHOOK_SECRET,
		NEXT_PUBLIC_NODE_ENV: process.env.NODE_ENV,
		KV_URL: process.env.KV_URL,
		KV_REST_API_URL: process.env.KV_REST_API_URL,
		KV_REST_API_TOKEN: process.env.KV_REST_API_TOKEN,
		KV_REST_API_READ_ONLY_TOKEN: process.env.KV_REST_API_READ_ONLY_TOKEN,
		UPLOADTHING_SECRET: process.env.UPLOADTHING_SECRET,
		UPLOADTHING_APP_ID: process.env.UPLOADTHING_APP_ID,
		ACCESS_TOKEN: process.env.ACCESS_TOKEN,
		BLOB_READ_WRITE_TOKEN: process.env.BLOB_READ_WRITE_TOKEN,
		GH_WEBHOOK_SECRET: process.env.GH_WEBHOOK_SECRET,
		GH_CLIENT_SECRET: process.env.GH_CLIENT_SECRET,
		GH_APP_PRIVATE_KEY_BASE_64: process.env.GH_APP_PRIVATE_KEY_BASE_64,
		TESTING: process.env.TESTING,
		NEXT_PUBLIC_VERCEL_URL: process.env.NEXT_PUBLIC_VERCEL_URL,
	},
	/**
	 * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. This is especially
	 * useful for Docker builds.
	 */
	skipValidation: !!process.env.SKIP_ENV_VALIDATION,
	/**
	 * Makes it so that empty strings are treated as undefined.
	 * `SOME_VAR: z.string()` and `SOME_VAR=''` will throw an error.
	 */
	emptyStringAsUndefined: true,
});
