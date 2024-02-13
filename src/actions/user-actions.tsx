"use server";

import { db } from "~/server/db";
import { type UserRole, usersToProjects } from "~/server/db/schema";

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