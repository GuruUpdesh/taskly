"use server";

import crypto from "crypto";

import { eq } from "drizzle-orm";
import { SignJWT } from "jose";
import { revalidatePath } from "next/cache";
import { z } from "zod";

import { env } from "~/env.mjs";
import { db } from "~/server/db";
import {
	projectToIntegrations,
	projectToIntegrationsSchema,
	projects,
	tasks,
} from "~/server/db/schema";

import { authenticate } from "../security/authenticate";

export async function addPendingIntegration(
	projectId: number,
	integrationId: string,
) {
	const userId = authenticate();
	const data = { projectId, integrationId, userId };
	console.log("GitHub Integration: addPendingIntegration", data);
	const validData = projectToIntegrationsSchema
		.pick({ projectId: true, integrationId: true, userId: true })
		.parse(data);

	const currentPendingIntegration =
		await db.query.projectToIntegrations.findFirst({
			where: (projectToIntegrations) =>
				eq(projectToIntegrations.userId, userId) &&
				eq(projectToIntegrations.integrationId, "github"),
		});

	if (currentPendingIntegration) {
		await db
			.update(projectToIntegrations)
			.set(validData)
			.where(eq(projectToIntegrations.userId, userId));
		return;
	}

	await db.insert(projectToIntegrations).values(validData);

	revalidatePath("/");
}

export async function cancelPendingIntegration(formData: FormData) {
	const id = formData.get("integrationId");
	if (!id) {
		return;
	}
	const integrationId = z.number().parse(parseInt(id as string, 10));
	await db
		.delete(projectToIntegrations)
		.where(eq(projectToIntegrations.id, integrationId));

	revalidatePath("/");
}

export async function resolvePendingIntegration(installationId: number) {
	console.log(
		"GitHub Integration: resolvePendingIntegration",
		installationId,
	);
	const userId = authenticate();
	const pendingIntegration = await db.query.projectToIntegrations.findFirst({
		where: (projectToIntegrations) =>
			eq(projectToIntegrations.userId, userId) &&
			eq(projectToIntegrations.integrationId, "github"),
	});
	console.log(
		"GitHub Integration: resolvePendingIntegration",
		pendingIntegration,
	);

	if (!pendingIntegration) {
		return;
	}

	await db
		.update(projects)
		.set({ githubIntegrationId: installationId })
		.where(eq(projects.id, pendingIntegration.projectId));
	await db
		.delete(projectToIntegrations)
		.where(eq(projectToIntegrations.userId, userId));
}

async function getAccessToken(installationId: number) {
	const privateKey = Buffer.from(
		env.GH_APP_PRIVATE_KEY_BASE_64,
		"base64",
	).toString("utf8");

	const appId = 853399;
	const secret = crypto.createPrivateKey(privateKey);

	const jwtToken = await new SignJWT()
		.setProtectedHeader({ alg: "RS256" })
		.setIssuer(appId.toString())
		.setIssuedAt()
		.setExpirationTime("10m")
		.sign(secret);

	const url = `https://api.github.com/app/installations/${installationId}/access_tokens`;
	const response = await fetch(url, {
		method: "POST",
		headers: {
			Authorization: `Bearer ${jwtToken}`,
			Accept: "application/vnd.github.v3+json",
		},
	});

	const data = (await response.json()) as unknown;

	if (!response.ok) {
		throw new Error(`GitHub API responded with status ${response.status}`);
	}

	const resultSchema = z.object({
		token: z.string(),
	});
	const result = resultSchema.parse(data);
	console.log("GitHub Integration: successful got access token");
	return result.token;
}

async function getRepos(accessToken: string) {
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

	console.log(
		"GitHub Integration: successful got repos",
		result.repositories,
	);
	return result.repositories;
}

export async function getConnectedGithubRepo(installationId: number | null) {
	if (!installationId) return null;
	try {
		const accessToken = await getAccessToken(installationId);
		return await getRepos(accessToken);
	} catch (error) {
		console.error("Failed to get GitHub installation access token:", error);
		return null;
	}
}

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
