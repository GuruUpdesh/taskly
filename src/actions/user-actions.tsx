"use server";

import { eq } from "drizzle-orm";

import { db } from "~/server/db";
import { type UserRole, usersToProjects } from "~/server/db/schema";

export async function addUserToProject(
	userId: string,
	projectId: number,
	role: UserRole = "member",
) {
	await db.insert(usersToProjects).values({
		userId,
		projectId,
		userRole: role,
	});
}

export async function getUser(userId: string) {
	const user = await db.query.users.findFirst({
		where: (users) => eq(users.userId, userId),
	});

	return user;
}
