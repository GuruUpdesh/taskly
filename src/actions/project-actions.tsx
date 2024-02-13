"use server";

import { revalidatePath } from "next/cache";
import { db } from "~/server/db";
import { eq } from "drizzle-orm";
import {
	projects,
	insertProjectSchema,
	type UserRole,
} from "~/server/db/schema";
import { type NewProject } from "~/server/db/schema";
import { throwServerError } from "~/utils/errors";
import { auth } from "@clerk/nextjs";

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
		if (error instanceof Error) throwServerError(error.message);
	}
}

export async function deleteProject(id: number) {
	try {
		await db.delete(projects).where(eq(projects.id, id));
		revalidatePath("/");
	} catch (error) {
		if (error instanceof Error) throwServerError(error.message);
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

export async function getIsProjectNameAvailable(
	projectName: string,
): Promise<boolean> {
	try {
		const projectQuery = await db.query.projects.findFirst({
			where: (project) => eq(project.name, projectName),
		});
		return !projectQuery;
	} catch (error) {
		if (error instanceof Error) throwServerError(error.message);
		return false;
	}
}

export type CreateForm = {
	name: NewProject["name"];
	description?: string;
	sprintDuration: number;
	sprintStart: Date;
	invitees: string[];
	timezoneOffset: number;
};

export async function checkPermission(
	projectId: number,
	userId: string,
	allowRoles: UserRole[],
) {
	try {
		const userToProject = await db.query.usersToProjects.findFirst({
			where: (up) => eq(up.projectId, projectId) && eq(up.userId, userId),
		});
		if (!userToProject) {
			return false;
		}
		if (allowRoles.includes(userToProject.userRole)) {
			return true;
		}
		return false;
	} catch (error) {
		if (error instanceof Error) throwServerError(error.message);
	}
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

		const users = usersQuery.map((userToProject) => userToProject.user);

		return users;
	} catch (error) {
		if (error instanceof Error) throwServerError(error.message);
		return [];
	}
}
