"use server";

import { eq } from "drizzle-orm";
import { db } from "~/server/db";
import { type UserRole, usersToProjects, type User } from "~/server/db/schema";
import { authenticate } from "./utils/action-utils";

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

type GetUserSuccess = {
	success: true;
	message: string;
	user: User;
};

type GetUserFailure = {
	success: false;
	message: string;
};

export type GetUserResponse = GetUserSuccess | GetUserFailure;

export async function getUser(): Promise<GetUserResponse> {
	const userId = authenticate();
	if (!userId) {
		return { success: false, message: "User not authenticated" };
	}

	const user = await db.query.users.findFirst({
		where: (user) => eq(user.userId, userId),
	});

	if (!user) {
		return { success: false, message: "User not found" };
	}

	return { success: true, message: "User found", user };
}
