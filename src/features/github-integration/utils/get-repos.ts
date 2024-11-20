"use server";

import { z } from "zod";

import { logger } from "~/lib/logger";

export async function getRepos(accessToken: string) {
	const url = `https://api.github.com/installation/repositories`;
	const response = await fetch(url, {
		method: "GET",
		headers: {
			Authorization: `Bearer ${accessToken}`,
			Accept: "application/vnd.github.v3+json",
		},
	});

	const data = (await response.json()) as unknown;
	const resultSchema = z.object({
		repositories: z.array(
			z.object({
				full_name: z.string(),
				html_url: z.string(),
				owner: z.object({
					login: z.string(),
					avatar_url: z.string(),
				}),
			}),
		),
	});
	const result = resultSchema.parse(data);

	logger.info(
		"[GITHUB INTEGRATION]: successful got repos",
		result.repositories,
	);
	return result.repositories;
}
