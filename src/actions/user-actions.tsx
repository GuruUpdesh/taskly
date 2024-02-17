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
import { revalidatePath } from "next/cache";
import { checkPermission } from "./project-actions";

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

	const hasPermission = await checkPermission(
		parseInt(currProjectId as string),
		userId,
		["owner", "admin", "member"],
	);
	if (!hasPermission) {
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
	const hasPermission = await checkPermission(projectId, userId, [
		"owner",
		"admin",
		"member",
	]);
	if (!hasPermission) {
		return false;
	}

	await db.delete(usersToProjects).where(eq(usersToProjects.userId, userId));

	await db
		.update(tasks)
		.set({ assignee: null })
		.where(and(eq(tasks.projectId, projectId), eq(tasks.assignee, userId)));
	return true;
}

export async function editUserRole(
	userToEdit: string,
	projectId: number,
	role: string,
) {
	const userId = authenticate();
	if (!userId) {
		return false;
	}

	const hasPermission = await checkPermission(projectId, userId, [
		"owner",
		"admin",
	]);
	if (!hasPermission) {
		return false;
	}
	if (!userToEdit || !projectId) {
		return false;
	}
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
