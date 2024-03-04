"use server";

import { and, eq } from "drizzle-orm";

import { db } from "~/server/db";
import { type UserRole } from "~/server/db/schema";

export async function checkPermissions(
	userId: string,
	projectId: number,
	roles?: UserRole[],
) {
	const userToProject = await db.query.usersToProjects.findFirst({
		where: (usersToProject) =>
			and(
				eq(usersToProject.projectId, projectId),
				eq(usersToProject.userId, userId),
			),
	});
	if (!userToProject) {
		throw new Error("User does not have access to this project");
	}

	if (!roles) return;
	const hasPermission = roles.includes(userToProject.userRole);
	if (!hasPermission) {
		throw new Error(
			`User role ${userToProject.userRole} does not have permission to access this resource`,
		);
	}
}
