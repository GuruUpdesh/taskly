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
} from "~/server/db/schema";

import { authenticate } from "../security/authenticate";

export async function addPendingIntegration(
	projectId: number,
	integrationId: string,
) {
	const userId = authenticate();
	const data = { projectId, integrationId, userId };
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

export async function resolvePendingIntegration(installationId: number) {
	const userId = authenticate();
	const pendingIntegration = await db.query.projectToIntegrations.findFirst({
		where: (projectToIntegrations) =>
			eq(projectToIntegrations.userId, userId) &&
			eq(projectToIntegrations.integrationId, "github"),
	});

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

export async function getConnectedGithubRepo(installationId: number | null) {
	if (!installationId) return null;

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
	try {
		const response = await fetch(url, {
			method: "POST",
			headers: {
				Authorization: `Bearer ${jwtToken}`,
				Accept: "application/vnd.github.v3+json",
			},
		});

		const data = (await response.json()) as unknown;

		if (!response.ok) {
			throw new Error(
				`GitHub API responded with status ${response.status}`,
			);
		}

		const resultSchema = z.object({
			token: z.string(),
		});
		const result = resultSchema.parse(data);
		const accessToken = result.token;

		const url2 = `https://api.github.com/installation/repositories`;
		const response2 = await fetch(url2, {
			method: "GET",
			headers: {
				Authorization: `Bearer ${accessToken}`,
				Accept: "application/vnd.github.v3+json",
			},
		});
		const data2 = (await response2.json()) as unknown;
		const result2Schema = z.object({
			repositories: z.array(
				z.object({
					full_name: z.string(),
					html_url: z.string(),
					owner: z.object({
						avatar_url: z.string(),
					}),
				}),
			),
		});

		const result2 = result2Schema.parse(data2);

		return result2.repositories;
	} catch (error) {
		console.error("Failed to get GitHub installation access token:", error);
		return null;
	}
}
