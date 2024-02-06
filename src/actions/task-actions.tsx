"use server";

import { auth } from "@clerk/nextjs";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { db } from "~/server/db";
import { tasks, insertTaskSchema__required } from "~/server/db/schema";
import { type Task, type NewTask } from "~/server/db/schema";
import { type Action } from "~/utils/action";
import { createError } from "~/utils/errors";

export async function createTask(data: NewTask): Promise<Action<Task>> {
	try {
		const validationResults = insertTaskSchema__required.safeParse(data);
		if (!validationResults.success) {
			return createError("Invalid data", validationResults.error);
		}

		const newTask = validationResults.data;
		const result = await db.insert(tasks).values(newTask);
		revalidatePath("/");

		return {
			status: "success",
			data: { id: parseInt(result.insertId), ...newTask },
		};
	} catch (error) {
		return createError("An error occurred while creating the task", error);
	}
}

export async function getTasksFromProject(
	projectId: number,
): Promise<Action<Task[]>> {
	try {
		const allTasks: Task[] = await db
			.select()
			.from(tasks)
			.where(eq(tasks.projectId, projectId));

		return {
			status: "success",
			data: allTasks,
		};
	} catch (error) {
		return createError("An error occurred while fetching tasks", error);
	}
}

export async function deleteTask(id: number): Promise<Action<number>> {
	try {
		const result = await db.delete(tasks).where(eq(tasks.id, id));
		console.log(result);
		revalidatePath("/");

		return {
			status: "success",
			data: id,
		};
	} catch (error) {
		return createError("An error occurred while deleting the task", error);
	}
}

export async function updateTask(
	id: number,
	data: NewTask,
): Promise<Action<Task>> {
	try {
		const validationResults = insertTaskSchema__required.safeParse(data);
		if (!validationResults.success) {
			return createError("Invalid data", validationResults.error);
		}
		const updatedTaskData = validationResults.data;

		if (updatedTaskData.assignee === "unassigned")
			updatedTaskData.assignee = null;

		await db.update(tasks).set(updatedTaskData).where(eq(tasks.id, id));
		revalidatePath("/");

		return {
			status: "success",
			data: { id, ...updatedTaskData },
		};
	} catch (error) {
		return createError("An error occurred while updating the task", error);
	}
}

export async function getTask(id: number): Promise<Action<Task>> {
	try {
		const { userId }: { userId: string | null } = auth();
		if (!userId) {
			return createError("User not found");
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
			return createError("Task not found");
		}
		if (!taskQuery.project.usersToProjects.length) {
			return createError("User not authorized to view this task");
		}

		return {
			status: "success",
			data: taskQuery,
		};
	} catch (error) {
		return createError("An error occurred while fetching the task", error);
	}
}
