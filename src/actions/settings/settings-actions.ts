"use server";

import chroma from "chroma-js";
import { and, eq, inArray } from "drizzle-orm";
import { getAverageColor } from "fast-average-color-node";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { authenticate } from "~/actions/security/authenticate";
import { checkPermissions } from "~/actions/security/permissions";
import { db } from "~/server/db";
import {
	type Project,
	projects,
	tasks,
	usersToProjects,
	sprints,
	invites,
	notifications,
	comments,
	taskHistory,
	tasksToViews,
} from "~/server/db/schema";

export async function handleProjectInfo(
	projectId: number,
	updatedValues: Partial<Project>,
) {
	const userId = authenticate();
	await checkPermissions(userId, projectId, ["owner", "admin"]);

	await db
		.update(projects)
		.set({ ...updatedValues })
		.where(eq(projects.id, projectId));

	revalidatePath("/");
}

export async function handleProjectTheme(
	projectId: number,
	updatedValues: { color: string; image: string },
) {
	const userId = authenticate();
	await checkPermissions(userId, projectId, ["owner", "admin", "member"]);

	await db
		.update(projects)
		.set({ color: updatedValues.color, image: updatedValues.image })
		.where(eq(projects.id, projectId));

	revalidatePath("/");
}

export async function autoColor(image: string) {
	return await getAverageColor(image).then((color: { hex: string }) => {
		const hex = color.hex;
		const vibrant = chroma(hex).saturate(1).hex();
		return vibrant;
	});
}

export async function handleDeleteProject(projectId: number) {
	const userId = authenticate();
	await checkPermissions(userId, projectId, ["owner"]);

	if (!projectId) {
		return { success: false, message: "Project ID not found" };
	}

	const project = await db
		.select()
		.from(projects)
		.where(eq(projects.id, projectId));
	if (!project || project.length === 0) {
		return { success: false, message: "Project not found" };
	}
	const projectData = project[0];
	if (!projectData) {
		return { success: false, message: "Project not found" };
	}
	await db.transaction(async (tx) => {
		const tasksToDelete = await tx
			.select({ id: tasks.id })
			.from(tasks)
			.where(eq(tasks.projectId, projectData.id));
		const tasksToDeleteIds: number[] = tasksToDelete.map((task) => task.id);
		await tx
			.delete(notifications)
			.where(eq(notifications.projectId, projectData.id));
		await tx.delete(projects).where(eq(projects.id, projectData.id));
		await tx
			.delete(usersToProjects)
			.where(eq(usersToProjects.projectId, projectData.id));
		await tx.delete(tasks).where(eq(tasks.projectId, projectData.id));
		await tx.delete(sprints).where(eq(sprints.projectId, projectData.id));
		await tx.delete(invites).where(eq(invites.projectId, projectData.id));
		if (tasksToDeleteIds.length > 0) {
			await tx
				.delete(comments)
				.where(inArray(comments.taskId, tasksToDeleteIds));
			await tx
				.delete(taskHistory)
				.where(inArray(taskHistory.taskId, tasksToDeleteIds));
			await tx
				.delete(tasksToViews)
				.where(inArray(tasksToViews.taskId, tasksToDeleteIds));
		}
	});
	redirect("/");
}

export async function leaveProject(projectId: number) {
	const userId = authenticate();
	await removeUserFromProject(projectId, userId);
}

export async function removeUserFromProject(projectId: number, userId: string) {
	const activeUserId = authenticate();
	if (activeUserId !== userId) {
		await checkPermissions(activeUserId, projectId, ["owner", "admin"]);
	}

	await db.delete(usersToProjects).where(eq(usersToProjects.userId, userId));

	await db
		.update(tasks)
		.set({ assignee: null })
		.where(and(eq(tasks.projectId, projectId), eq(tasks.assignee, userId)));

	if (activeUserId !== userId) {
		revalidatePath("/");
	} else {
		redirect("/");
	}
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
