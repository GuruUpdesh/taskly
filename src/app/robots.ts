import { type MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
	return {
		rules: {
			userAgent: "*",
			allow: "/",
			disallow: ["/project", "/settings", "/app"],
		},
		sitemap: `https://tasklypm.com/sitemap.xml`,
	};
}
