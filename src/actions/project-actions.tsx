"use server";

import { revalidatePath } from "next/cache";
import { db } from "~/server/db";
import { eq } from "drizzle-orm";
import {
	projects,
	insertProjectSchema,
	usersToProjects,
} from "~/server/db/schema";
import { type NewProject } from "~/server/db/schema";
import { throwServerError } from "~/utils/errors";
import { auth } from "@clerk/nextjs";
import { sendEmailInvites } from "./invite-actions";

// top level await workaround from https://github.com/vercel/next.js/issues/54282
// eslint-disable-next-line @typescript-eslint/no-empty-function
export async function initAction() {}

type ProjectResponse = {
	newProjectId: number;
	status: boolean;
	message: string;
};

export async function createProject(
	data: NewProject,
): Promise<ProjectResponse> {
	try {
		// get user from auth headers
		const { userId } = auth();
		if (!userId) {
			return {
				newProjectId: -1,
				status: false,
				message: "UserId not found",
			};
		}

		// insert project

		const newProject: NewProject = insertProjectSchema.parse(data);
		const result = await db.insert(projects).values(newProject);
		const insertId = parseInt(result.insertId);

		// add user to project
		await db
			.insert(usersToProjects)
			.values({ userId: userId, projectId: insertId });

		revalidatePath("/");

		return {
			newProjectId: insertId,
			status: true,
			message: "Project created successfully",
		};
	} catch (error) {
		if (error instanceof Error) {
			if (error.message.includes("Duplicate entry")) {
				return {
					newProjectId: -1,
					status: false,
					message: "Project name already exists",
				};
			}
			return {
				newProjectId: -1,
				status: false,
				message: error.message,
			};
		} else {
			return {
				newProjectId: -1,
				status: false,
				message: "Unknown error",
			};
		}
	}
}

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

export async function getAsigneesForProject(projectId: number) {
	try {
		const asigneesQuery = await db.query.projects.findMany({
			where: (project) => eq(project.id, projectId),
			with: {
				usersToProjects: {
					with: {
						user: true,
					},
				},
			},
		});
		const assignees = asigneesQuery.flatMap((userToProject) =>
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
	invitees: string[];
	description?: string;
};
export async function createProjectAndInviteUsers(formData: CreateForm) {
	const { userId } = auth();
	if (!userId) {
		return {
			newProjectId: -1,
			status: false,
			message: "UserId not found",
		};
	}

	// get user from auth headers
	const result = await createProject(formData);
	if (!result.status) {
		return result;
	}

	const insertId = result.newProjectId;

	// invite users
	const inviteResult = await sendEmailInvites(
		insertId,
		formData.invitees,
		formData.name,
	);
	if (!inviteResult.status) {
		return {
			newProjectId: insertId,
			status: true,
			message: "Project created successfully but " + inviteResult.message,
		};
	}

	return {
		newProjectId: insertId,
		status: true,
		message: "Project created successfully and invites sent",
	};
}
