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

export async function getAllProjects() {
	try {
		const allProjects: Project[] = await db.select().from(projects);
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
