"use server";

import { db } from "~/server/db";
import { projects } from "~/server/db/schema";
import { revalidatePath } from "next/cache";
import { eq } from "drizzle-orm";

export async function handleDeleteProject(formData: FormData) {
	const projectId = formData.get("projectId");

	if (!projectId) {
		return { success: false, message: "Project ID not found" };
	}

	const project = await db
		.select()
		.from(projects)
		.where(eq(projects.id, parseInt(projectId as string)));
	if (!project || project.length === 0) {
		return { success: false, message: "Project not found" };
	}
	const projectData = project[0];
	if (!projectData) {
		return { success: false, message: "Project not found" };
	}
	await db.delete(projects).where(eq(projects.id, projectData.id));
	revalidatePath("/");
	return { success: true, message: "Project deleted" };
}
