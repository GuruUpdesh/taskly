"use server";

import { and, eq } from "drizzle-orm";
import { db } from "~/server/db";
import { Task, tasksToViews } from "~/server/db/schema";

export async function updateOrInsertTaskView(taskId: number, userId: string) {
	const taskView = await db.query.tasksToViews.findFirst({
		where: (tasksToViews) =>
			and(
				eq(tasksToViews.taskId, taskId),
				eq(tasksToViews.userId, userId),
			),
	});

	if (taskView) {
		await db
			.update(tasksToViews)
			.set({ viewedAt: new Date() })
			.where(
				and(
					eq(tasksToViews.taskId, taskId),
					eq(tasksToViews.userId, userId),
				),
			);
	} else {
		await db
			.insert(tasksToViews)
			.values({ taskId, userId, viewedAt: new Date() });
	}
}

export async function getMostRecentTasks(userId: string, number = 5) {
	const { recentlyViewed, recentlyEdited, recentlyCreated } =
		await db.transaction(async (tx) => {
			const recentlyViewed = await tx.query.tasksToViews.findMany({
				where: (tasksToViews) => eq(tasksToViews.userId, userId),
				orderBy: (tasksToViews, { desc }) => [
					desc(tasksToViews.viewedAt),
				],
				limit: number,
				with: {
					task: true,
				},
			});
			const recentlyEdited = await tx.query.tasks.findMany({
				orderBy: (tasks, { desc }) => [desc(tasks.lastEditedAt)],
				limit: number,
			});
			const recentlyCreated = await tx.query.tasks.findMany({
				orderBy: (tasks, { desc }) => [desc(tasks.insertedDate)],
				limit: number,
			});

			return { recentlyViewed, recentlyEdited, recentlyCreated };
		});

	console.log("recentlyViewed:", recentlyViewed);
	console.log("recentlyEdited:", recentlyEdited);
	console.log("recentlyCreated:", recentlyCreated);

	type TaskCategory = "created" | "edited" | "viewed";
	type TaskWithCategory = Task & { category: TaskCategory };
	const taskMap = new Map<number, TaskWithCategory>();
	const addTasks = (tasks: Task[], category: TaskCategory) => {
		tasks.forEach((task) => {
			if (!taskMap.has(task.id)) {
				taskMap.set(task.id, { ...task, category });
			}
		});
	};

	addTasks(recentlyCreated, "created");
	addTasks(recentlyEdited, "edited");
	addTasks(
		recentlyViewed.map((v) => v.task),
		"viewed",
	);

	console.log(taskMap);

	const sortedTasks = Array.from(taskMap.values())
		.sort((a, b) => {
			if (a.category === "created" && b.category !== "created") return -1;
			if (b.category === "created" && a.category !== "created") return 1;
			if (a.category === "edited" && b.category !== "edited") return -1;
			if (b.category === "edited" && a.category !== "edited") return 1;
			return 0;
		})
		.slice(0, number);

	return sortedTasks;
}
