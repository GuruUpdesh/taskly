"use server";

import { db } from "~/server/db";
import { authenticate } from "../security/authenticate";
import { checkPermissions } from "../security/permissions";
import { eq } from "drizzle-orm";
import { comments } from "~/server/db/schema";
import { revalidatePath } from "next/cache";

export async function createComment( comment: string, taskId: number) {
	
	
	const userId = authenticate();

	const task = await db.query.tasks.findFirst({
		where : (task) => eq(task.id, taskId),
	});
	if(!task) return;

	await checkPermissions(userId, task.projectId);
	
	await db.insert(comments).values({
		comment,
		taskId: taskId,
		userId,
		insertedDate: new Date(),
	});	
	revalidatePath("/");
}

