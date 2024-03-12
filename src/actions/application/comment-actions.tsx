"use server";

import { and, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

import { db } from "~/server/db";
import { comments } from "~/server/db/schema";

import { createNotification } from "../notification-actions";
import { authenticate } from "../security/authenticate";
import { checkPermissions } from "../security/permissions";

export async function createComment(comment: string, taskId: number) {
	const userId = authenticate();

	let commentWithUsers: string = comment;

	while (commentWithUsers.includes("(user_")) {
		const start = commentWithUsers.indexOf("(user_");
		const end = commentWithUsers.indexOf(")", start);
		const userId = commentWithUsers.substring(start + 1, end);
		console.log(userId);
		const user = await db.query.users.findFirst({
			where: (user) => eq(user.userId, userId),
		});
		if (!user) {
			commentWithUsers = commentWithUsers.replace(
				`(${userId})`,
				"Unknown User",
			);
		} else {
			const task = await db.query.tasks.findFirst({
				where: (task) => eq(task.id, taskId),
			});

			const currUser = await db.query.users.findFirst({
				where: (user) => eq(user.userId, userId),
			});

			await createNotification({
				date: new Date(),
				message: `You were mentioned in a comment by ${currUser?.username}.`,
				userId: user.userId,
				taskId: taskId,
				projectId: task?.projectId ?? 0,
			});

			commentWithUsers = commentWithUsers.replace(
				`(${userId})`,
				user.username,
			);
		}
	}

	const task = await db.query.tasks.findFirst({
		where: (task) => eq(task.id, taskId),
	});
	if (!task) return;

	await checkPermissions(userId, task.projectId);

	await db.insert(comments).values({
		comment,
		taskId: taskId,
		userId,
		insertedDate: new Date(),
	});
	revalidatePath("/");
}

export async function deleteComment(commentId: number) {
	const userId = authenticate();

	await db
		.delete(comments)
		.where(and(eq(comments.id, commentId), eq(comments.userId, userId)));
	revalidatePath("/");
}
