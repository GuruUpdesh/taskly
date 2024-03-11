"use server";

import { auth } from "@clerk/nextjs";
import { eq } from "drizzle-orm";
import jwt from "jsonwebtoken";
import { revalidatePath } from "next/cache";
import { z } from "zod";

import { env } from "~/env.mjs";
import { db } from "~/server/db";
import {
	projects,
	insertProjectSchema,
	type User,
	type UserRole,
	projectToIntegrations,
	projectToIntegrationsSchema,
} from "~/server/db/schema";
import { type NewProject } from "~/server/db/schema";
import { throwServerError } from "~/utils/errors";

import { authenticate } from "../security/authenticate";

// top level await workaround from https://github.com/vercel/next.js/issues/54282
// eslint-disable-next-line @typescript-eslint/no-empty-function
export async function initAction() {}

export async function getAllProjects(userId: string) {
	try {
		const projectsQuery = await db.query.users.findMany({
			where: (user) => eq(user.userId, userId),
			with: {
				usersToProjects: {
					with: {
						project: true,
					},
				},
			},
		});
		const allProjects = projectsQuery.flatMap((userToProject) =>
			userToProject.usersToProjects.map((up) => up.project),
		);
		return allProjects;
	} catch (error) {
		if (error instanceof Error) throwServerError(error.message);
	}
}

export async function getProject(projectId: number) {
	try {
		const { userId }: { userId: string | null } = auth();
		if (!userId) {
			return { success: false, message: "UserId not found" };
		}
		const projectQuery = await db.query.projects.findFirst({
			where: (projects) => eq(projects.id, projectId),
			with: {
				usersToProjects: {
					with: {
						user: true,
					},
					where: (user) => eq(user.userId, userId),
				},
			},
		});
		if (!projectQuery) {
			return { success: false, message: "Project not found" };
		}
		if (!projectQuery.usersToProjects.length) {
			return { success: false, message: "Project not found" };
		}

		return { success: true, project: projectQuery };
	} catch (error) {
		console.error(error);
		if (error instanceof Error) {
			return { success: false, message: error.message };
		}
		return { success: false, message: "Unknown error" };
	}
}

export async function updateProject(id: number, data: NewProject) {
	try {
		const newProject: NewProject = insertProjectSchema.parse(data);
		await db.update(projects).set(newProject).where(eq(projects.id, id));
		revalidatePath("/");

		// todo return updated project
	} catch (error) {
		if (error instanceof Error) throwServerError(error.message);
	}
}

export async function getAssigneesForProject(projectId: number) {
	try {
		const assigneesQuery = await db.query.projects.findMany({
			where: (project) => eq(project.id, projectId),
			with: {
				usersToProjects: {
					with: {
						user: true,
					},
				},
			},
		});
		const assignees = assigneesQuery.flatMap((userToProject) =>
			userToProject.usersToProjects.map((up) => up.user),
		);

		return assignees;
	} catch (error) {
		if (error instanceof Error) throwServerError(error.message);
		return [];
	}
}

export interface UserWithRole extends User {
	userRole: UserRole;
}
export async function getAllUsersInProject(projectId: number) {
	try {
		const usersQuery = await db.query.usersToProjects.findMany({
			where: (usersToProjects) =>
				eq(usersToProjects.projectId, projectId),
			with: {
				user: true,
			},
		});

		const users = usersQuery.map((userToProject) => ({
			...userToProject.user,
			userRole: userToProject.userRole,
		}));

		return users;
	} catch (error) {
		if (error instanceof Error) throwServerError(error.message);
		return [];
	}
}

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
	const now = Math.floor(Date.now() / 1000);
	const payload = {
		iat: now - 60,
		exp: now + 10 * 60,
		iss: appId,
	};

	// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
	const jwtToken = jwt.sign(payload, privateKey, { algorithm: "RS256" });

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
