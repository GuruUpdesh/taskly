"use server";

import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { db } from "~/server/db";
import { projects, insertProjectSchema } from "~/server/db/schema";
import { type Project, type NewProject } from "~/server/db/schema";

export async function createProject(data: NewProject) {
	try {
		const newProject: NewProject = insertProjectSchema.parse(data);
		await db.insert(projects).values(newProject);
		revalidatePath("/");
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

export async function updateProject(id: number, data: NewProject) {
	try {
		const newProject: NewProject = insertProjectSchema.parse(data);
		await db.update(projects).set(newProject).where(eq(projects.id, id));
		revalidatePath("/");
	} catch (error) {
		if (error instanceof Error) console.log(error.stack);
	}
}
