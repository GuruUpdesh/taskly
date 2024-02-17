"use server";

import { db } from "~/server/db";
import { projects, tasks, usersToProjects } from "~/server/db/schema";
import { and, eq } from "drizzle-orm";
import { redirect } from "next/navigation";
import { authenticate } from "../security/authenticate";
import { checkPermissions } from "../security/permissions";
import { revalidatePath } from "next/cache";

export async function handleDeleteProject(formData: FormData) {
	const userId = authenticate();
	const projectId = formData.get("projectId");
	await checkPermissions(
		userId,
		parseInt(formData.get("projectId") as string),
		["owner"],
	);

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

export async function removeUserFormProject_formData(formData: FormData) {
	const currProjectId = formData.get("projectId");
	const userId = authenticate();
	await removeUserFromProject(Number(currProjectId), userId);
}

export async function removeUserFromProject(projectId: number, userId: string) {
	await db.delete(usersToProjects).where(eq(usersToProjects.userId, userId));

	await db
		.update(tasks)
		.set({ assignee: null })
		.where(
			and(
				eq(tasks.projectId, projectId),
				eq(tasks.assignee, String(userId)),
			),
		);

	redirect("/");
}

export async function editUserRole(
	userToEdit: string,
	projectId: number,
	role: string,
) {
	const userId = authenticate();
	await checkPermissions(userId, projectId, ["owner", "admin"]);

	if (role !== "owner" && role !== "member" && role !== "admin") {
		return false;
	}

	await db
		.update(usersToProjects)
		.set({ userRole: role })
		.where(
			and(
				eq(usersToProjects.userId, userToEdit),
				eq(usersToProjects.projectId, projectId),
			),
		);

	revalidatePath("/");
}
