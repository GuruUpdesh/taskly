"use server";

import { and, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

import { db } from "~/server/db";
import { comments } from "~/server/db/schema";

import { authenticate } from "../security/authenticate";
import { checkPermissions } from "../security/permissions";

export async function createComment(comment: string, taskId: number) {
	const userId = authenticate();

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
