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
import { auth } from "@clerk/nextjs";

// top level await workaround from https://github.com/vercel/next.js/issues/54282
// eslint-disable-next-line @typescript-eslint/no-empty-function
export async function initAction() {}

export async function createProject(data: NewProject) {
	try {
		// get user from auth headers
		const { userId } = auth();
		if (!userId) throw new Error("userId not found");

		// insert project
		const newProject: NewProject = insertProjectSchema.parse(data);
		const result = await db.insert(projects).values(newProject);

		// check if insert was successful
		if (!(Array.isArray(result) && result[0])) {
			throw new Error("Project creation failed");
		}

		const { insertId } = result[0];

		// add user to project
		await db
			.insert(usersToProjects)
			.values({ userId: userId, projectId: insertId });

		revalidatePath("/");

		return insertId;
	} catch (error) {
		if (error instanceof Error) console.log(error.stack);
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
		if (error instanceof Error) console.log(error.stack);
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
		if (error instanceof Error) console.log(error.stack);
	}
}

export async function deleteProject(id: number) {
	try {
		await db.delete(projects).where(eq(projects.id, id));
		revalidatePath("/");
	} catch (error) {
		if (error instanceof Error) console.log(error.stack);
	}
}
