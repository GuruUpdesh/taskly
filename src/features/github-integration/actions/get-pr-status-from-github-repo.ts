"use server";

import { eq } from "drizzle-orm";
import { z } from "zod";

import { db } from "~/db";
import { tasks, projects } from "~/schema";

import { getAccessToken } from "../utils/get-access-token";
import { getRepos } from "../utils/get-repos";

export async function getPRStatusFromGithubRepo(taskId: number) {
	const taskResults = await db
		.select()
		.from(tasks)
		.where(eq(tasks.id, taskId))
		.limit(1);
	const task = taskResults[0];
	if (!task) return null;
	const branchName = task.branchName;

	const projectResults = await db
		.select()
		.from(projects)
		.where(eq(projects.id, task.projectId))
		.limit(1);
	const project = projectResults[0];
	if (!project) return null;

	const installationId = project.githubIntegrationId;
	if (!installationId) return null;

	try {
		const accessToken = await getAccessToken(installationId);
		const repos = await getRepos(accessToken);

		for (const repo of repos) {
			const url = `https://api.github.com/repos/${repo.full_name}/pulls?head=${repo.owner.login}:${branchName}&state=all`;
			const response = await fetch(url, {
				method: "GET",
				headers: {
					Authorization: `Bearer ${accessToken}`,
					Accept: "application/vnd.github.v3+json",
				},
			});

			const data = (await response.json()) as unknown;
			const resultSchema = z.array(
				z.object({
					html_url: z.string(),
					number: z.number(),
					state: z.enum(["open", "closed", "merged"]),
					title: z.string(),
					created_at: z.string(),
					updated_at: z.string(),
					closed_at: z.string().nullable(),
					merged_at: z.string().nullable(),
				}),
			);
			const pullRequestResults = resultSchema.parse(data);
			for (const pr of pullRequestResults) {
				const mergedUrl = `https://api.github.com/repos/${repo.full_name}/pulls/${pr.number}/merge`;
				const mergedResponse = await fetch(mergedUrl, {
					method: "GET",
					headers: {
						Authorization: `Bearer ${accessToken}`,
						Accept: "application/vnd.github.v3+json",
					},
				});
				console.log(mergedUrl);
				// if status is 204, then PR is merged
				if (mergedResponse.status === 204) {
					console.log("GitHub Integration: PR is merged");
					pr.state = "merged";
				}
			}
			console.log(
				"GitHub Integration: successful got PRs",
				pullRequestResults,
			);
			return pullRequestResults;
		}
	} catch (error) {
		console.error("Failed to get GitHub PR from branch name:", error);
		return null;
	}
}
