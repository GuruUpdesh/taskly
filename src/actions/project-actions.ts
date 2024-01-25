"use server";

import { revalidatePath } from "next/cache";
import { db } from "~/server/db";
import { eq } from "drizzle-orm";
import {
	projects,
	insertProjectSchema,
	usersToProjects,
} from "~/server/db/schema";
import { type Project, type NewProject } from "~/server/db/schema";
import { throwServerError } from "~/utils/errors";
import { auth } from "@clerk/nextjs";

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

export async function getProject(id: number) {
	try {
		const allProjects: Project[] = await db
			.select()
			.from(projects)
			.where(eq(projects.id, id));
		return allProjects[0];
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
