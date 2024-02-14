"use server";

import { and, eq } from "drizzle-orm";
import { db } from "~/server/db";
import { type UserRole, usersToProjects, tasks } from "~/server/db/schema";
import { authenticate } from "./utils/action-utils";
import { redirect } from "next/navigation";

export async function addUserToProject(
	userId: string,
	projectId: number,
	role: UserRole = "member",
) {
	try {
		await db.insert(usersToProjects).values({
			userId,
			projectId,
			userRole: role,
		});

		return true;
	} catch (error) {
		return false;
	}
}

export async function removeUserFromProject(formData: FormData) {
	const currProjectId = formData.get("projectId");
	const userId = authenticate();

	if (!currProjectId || !userId) {
		return false;
	}
	await db
		.delete(usersToProjects)
		.where(eq(usersToProjects.userId, String(userId)));

	await db
		.update(tasks)
		.set({ assignee: null })
		.where(
			and(
				eq(tasks.projectId, Number(currProjectId)),
				eq(tasks.assignee, String(userId)),
			),
		);

	redirect("/");
}
