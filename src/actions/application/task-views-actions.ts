"use server";

import { and, eq } from "drizzle-orm";

import { authenticate } from "~/actions/security/authenticate";
import { db } from "~/server/db";
import { tasksToViews } from "~/server/db/schema";

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

export async function getMostRecentTasks(projectId: number, number = 5) {
	const userId = authenticate();
	if (!userId) return [];

	const { recentlyViewed, recentlyEdited, recentlyCreated } =
		await db.transaction(async (tx) => {
			let recentlyViewed = await tx.query.tasksToViews.findMany({
				where: (tasksToViews) => eq(tasksToViews.userId, userId),
				orderBy: (tasksToViews, { desc }) => [
					desc(tasksToViews.viewedAt),
				],
				with: {
					task: true,
				},
			});
			recentlyViewed = recentlyViewed.filter(
				(v) => v.task.projectId === projectId,
			);

			const recentlyEdited = await tx.query.tasks.findMany({
				where: (tasks) => eq(tasks.projectId, projectId),
				orderBy: (tasks, { desc }) => [desc(tasks.lastEditedAt)],
			});
			const recentlyCreated = await tx.query.tasks.findMany({
				where: (tasks) => eq(tasks.projectId, projectId),
				orderBy: (tasks, { desc }) => [desc(tasks.insertedDate)],
			});

			return { recentlyViewed, recentlyEdited, recentlyCreated };
		});

	// Deduplicate and categorize tasks
	const categorizedTasks = {
		created: recentlyCreated.map((task) => ({
			...task,
			category: "created",
			categoryTimestamp: task.insertedDate,
		})),
		edited: recentlyEdited.map((task) => ({
			...task,
			category: "edited",
			categoryTimestamp: task.lastEditedAt,
		})),
		viewed: recentlyViewed.map((v) => ({
			...v.task,
			category: "viewed",
			categoryTimestamp: v.viewedAt,
		})),
	};

	// Function to distribute tasks dynamically
	const distributeTasksDynamically = () => {
		const distribution = [];
		const categories = ["viewed", "created", "edited"];
		const limits = {
			viewed: Math.ceil(number / 3),
			created: Math.floor((number + 1) / 3),
			edited: Math.floor((number + 2) / 3),
		};
		const seenTaskIds = new Set();

		for (const category of categories) {
			let added = 0;
			for (const task of categorizedTasks[
				category as keyof typeof categorizedTasks
			]) {
				if (
					!seenTaskIds.has(task.id) &&
					added < limits[category as keyof typeof limits]
				) {
					distribution.push(task);
					seenTaskIds.add(task.id);
					added++;
				}
			}
		}

		if (distribution.length < number) {
			for (const category of categories) {
				for (const task of categorizedTasks[
					category as keyof typeof categorizedTasks
				]) {
					if (!seenTaskIds.has(task.id)) {
						distribution.push(task);
						seenTaskIds.add(task.id);
						if (distribution.length === number) break;
					}
				}
				if (distribution.length === number) break;
			}
		}

		return distribution;
	};

	const sortedTasks = distributeTasksDynamically().slice(0, number);
	return sortedTasks;
}

export async function deleteViewsForTask(taskId: number) {
	const userId = authenticate();
	if (!userId) return;

	await db
		.delete(tasksToViews)
		.where(
			and(
				eq(tasksToViews.taskId, taskId),
				eq(tasksToViews.userId, userId),
			),
		);
}
