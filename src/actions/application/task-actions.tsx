"use server";

import { auth } from "@clerk/nextjs";
import { and, eq, gt, max, ne, sql } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { db } from "~/server/db";
import { tasks, insertTaskSchema__required } from "~/server/db/schema";
import { type Task, type NewTask } from "~/server/db/schema";
import { throwServerError } from "~/utils/errors";
import {
	deleteViewsForTask,
	updateOrInsertTaskView,
} from "./task-views-actions";
import { type StatefulTask } from "~/config/task-entity";

export async function createTask(data: NewTask) {
	try {
		const newTask = insertTaskSchema__required.parse(data);

		const maxBacklogOrder = await db
			.select({ backlogOrder: max(tasks.backlogOrder) })
			.from(tasks)
			.where(eq(tasks.projectId, newTask.projectId))
			.limit(1);

		if (
			maxBacklogOrder?.[0]?.backlogOrder !== undefined &&
			maxBacklogOrder[0].backlogOrder !== null
		) {
			newTask.backlogOrder = maxBacklogOrder[0].backlogOrder + 1;
			newTask.boardOrder = maxBacklogOrder[0].backlogOrder + 1;
		}

		await db.insert(tasks).values(newTask);
		revalidatePath("/");
	} catch (error) {
		console.error(error);
		if (error instanceof Error) throwServerError(error.message);
	}
}

export async function getAllTasks() {
	try {
		const allTasks: Task[] = await db.select().from(tasks);
		return allTasks;
	} catch (error) {
		if (error instanceof Error) throwServerError(error.message);
	}
}

export async function getTasksFromProject(projectId: number) {
	try {
		const allTasks: Task[] = await db
			.select()
			.from(tasks)
			.where(eq(tasks.projectId, projectId));

		const statefulTasks: StatefulTask[] = allTasks.map((task) => ({
			...task,
			options: {},
		}));

		return statefulTasks;
	} catch (error) {
		if (error instanceof Error) throwServerError(error.message);
	}
}

export async function deleteTask(id: number) {
	try {
		// get all the tasks from the project that who's order is greater than the task being deleted
		const task = await db.query.tasks.findFirst({
			where: (tasks) => eq(tasks.id, id),
		});
		if (!task) return;

		// update the boardOrder and backlogOrder of the tasks
		await db.transaction(async (tx) => {
			await tx
				.update(tasks)
				.set({ boardOrder: sql`${tasks.boardOrder} - 1` })
				.where(
					and(
						eq(tasks.projectId, task.projectId),
						gt(tasks.boardOrder, task.boardOrder),
						ne(tasks.id, id),
					),
				);
			await tx
				.update(tasks)
				.set({ backlogOrder: sql`${tasks.backlogOrder} - 1` })
				.where(
					and(
						eq(tasks.projectId, task.projectId),
						gt(tasks.backlogOrder, task.backlogOrder),
						ne(tasks.id, id),
					),
				);
		});

		await db.delete(tasks).where(eq(tasks.id, id));

		void deleteViewsForTask(id);
		revalidatePath("/");
	} catch (error) {
		if (error instanceof Error) throwServerError(error.message);
	}
}

export async function updateTask(id: number, data: NewTask) {
	try {
		const updatedTaskData = insertTaskSchema__required.parse(data);
		const currentTask = await db
			.select()
			.from(tasks)
			.where(eq(tasks.id, id));
		const currTask = currentTask[0];
		if (!currTask) return;
		if (updatedTaskData.assignee === "unassigned")
			updatedTaskData.assignee = null;

		updatedTaskData.lastEditedAt = new Date();

		if (updatedTaskData.status === "backlog" && currTask.sprintId !== -1) {
			updatedTaskData.sprintId = -1;
		} else if (
			updatedTaskData.sprintId !== -1 &&
			updatedTaskData.status === "backlog"
		) {
			updatedTaskData.status = "todo";
		}
		await db.update(tasks).set(updatedTaskData).where(eq(tasks.id, id));
		revalidatePath("/");
	} catch (error) {
		if (error instanceof Error) throwServerError(error.message);
	}
}

export async function getTask(id: number) {
	try {
		const { userId }: { userId: string | null } = auth();
		if (!userId) {
			return { success: false, message: "UserId not found" };
		}

		const taskQuery = await db.query.tasks.findFirst({
			where: (tasks) => eq(tasks.id, id),
			with: {
				project: {
					with: {
						usersToProjects: {
							with: {
								user: true,
							},
							where: (user) => eq(user.userId, userId),
						},
					},
				},
			},
		});
		if (!taskQuery) {
			return { success: false, message: "Task not found" };
		}
		if (!taskQuery.project.usersToProjects.length) {
			return { success: false, message: "User not authorized" };
		}

		void updateOrInsertTaskView(id, userId);

		return { success: true, task: taskQuery };
	} catch (error) {
		if (error instanceof Error) throwServerError(error.message);
	}
}
