import { type MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
	return [
		{
			url: `${process.env.NEXT_PUBLIC_BASE_URL}/`,
			lastModified: new Date(),
			priority: 1,
		},
		{
			url: `${process.env.NEXT_PUBLIC_BASE_URL}/sign-in`,
			lastModified: new Date(),
			priority: 0.8,
		},
		{
			url: `${process.env.NEXT_PUBLIC_BASE_URL}/sign-up`,
			lastModified: new Date(),
			priority: 0.8,
		},
	];
}
