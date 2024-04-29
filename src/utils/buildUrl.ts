import { env } from "~/env.mjs";

const buildUrl = (path: string): string => {
	const environment = process.env.NODE_ENV;
	if (environment === "development") {
		return `http://${env.NEXT_PUBLIC_VERCEL_URL}${path}`;
	} else {
		return `https://${env.NEXT_PUBLIC_VERCEL_URL}${path}`;
	}
};

export default buildUrl;
