"use server";

import { db } from "~/server/db";
import {
	type UserRole,
	usersToProjects,
	type User,
	tasks,
} from "~/server/db/schema";
import { authenticate } from "./utils/action-utils";
import { and, eq } from "drizzle-orm";
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

export async function deleteUserFromProject(userId: string, projectId: number) {

	//console.log('reched delete function')

	if (!userId || !projectId) {
		return false;
	}
	await db
		.delete(usersToProjects)
		.where(eq(usersToProjects.userId, userId))

	await db
		.update(tasks)
		.set({ assignee: null })
		.where(
			and(
				eq(tasks.projectId, projectId),
				eq(tasks.assignee, userId),
			),
		);
	return true;

}


