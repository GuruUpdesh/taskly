"use server";

import { kv } from "@vercel/kv";
import { eq } from "drizzle-orm";
import { z } from "zod";

import { db } from "~/server/db";
import { tasks } from "~/server/db/schema";

export async function updateOrder(taskOrder: Map<number, number>) {
	const task_ids: string[] = Array.from(taskOrder.keys()).map(String);
	const lockedTaskIds = await kv.get("taskOrder");
	if (lockedTaskIds) {
		const arrayOfLockedTaskIds = z.array(z.string()).parse(lockedTaskIds);
		if (arrayOfLockedTaskIds.some((id) => task_ids.includes(id))) {
			throw new Error("Some tasks are currently being updated");
		}
	}
	await kv.set("taskOrder", task_ids);
	await db.transaction(async (tx) => {
		for (const [taskId, backlogOrder] of taskOrder) {
			await tx
				.update(tasks)
				.set({ backlogOrder: backlogOrder })
				.where(eq(tasks.id, taskId));
		}
	});
	await kv.del("taskOrder");
}
