import { type MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
	return [
		{
			url: `https://tasklypm.com/`,
			lastModified: new Date(),
			priority: 1,
		},
		{
			url: `https://tasklypm.com/sign-in`,
			lastModified: new Date(),
			priority: 0.8,
		},
		{
			url: `https://tasklypm.com/sign-up`,
			lastModified: new Date(),
			priority: 0.8,
		},
	];
}
