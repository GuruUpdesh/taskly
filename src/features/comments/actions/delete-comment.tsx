"use server";

import { and, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

import { authenticate } from "~/actions/security/authenticate";
import { db } from "~/server/db";
import { comments } from "~/server/db/schema";

export async function deleteComment(commentId: number) {
	const userId = await authenticate();

	await db
		.delete(comments)
		.where(and(eq(comments.id, commentId), eq(comments.userId, userId)));
	revalidatePath("/");
}
