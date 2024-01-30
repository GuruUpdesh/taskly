"use server";

import { db } from "~/server/db";
import { projects, usersToProjects } from "~/server/db/schema";
import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";

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
	await db
		.delete(usersToProjects)
		.where(eq(usersToProjects.projectId, projectData.id));
	redirect("/");
}
