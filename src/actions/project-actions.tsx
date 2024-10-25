"use server";

import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

import { db } from "~/server/db";
import {
	projects,
	insertProjectSchema,
	type User,
	type UserRole,
	type UsersToProjects,
	type Project,
} from "~/server/db/schema";
import { type NewProject } from "~/server/db/schema";
import { type ActionReturnType } from "~/utils/actionReturnType";
import { throwServerError } from "~/utils/errors";

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

interface ProjectWithUser extends Project {
	usersToProjects: UsersToProjects[];
}

export async function getProject(
	projectId: number,
	userId: string,
): Promise<ActionReturnType<ProjectWithUser>> {
	try {
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
			return { data: null, error: `Project ${projectId} not found` };
		}
		if (projectQuery.usersToProjects.length === 0) {
			return {
				data: null,
				error: `Project ${projectId} is not related to your account`,
			};
		}

		return { data: projectQuery, error: null };
	} catch (error) {
		console.error(error);
		if (error instanceof Error) {
			return { data: null, error: error.message };
		}
		return { data: null, error: "An unknown error occurred" };
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

export async function getAssigneesForProject(
	projectId: number,
): Promise<ActionReturnType<User[]>> {
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
		const assignees = assigneesQuery
			.flatMap((userToProject) =>
				userToProject.usersToProjects.map((up) => up.user),
			)
			.filter(Boolean);

		return { data: assignees, error: null };
	} catch (error) {
		console.error(error);
		if (error instanceof Error) {
			return { data: null, error: error.message };
		}
		return { data: null, error: "An unknown error occurred" };
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
