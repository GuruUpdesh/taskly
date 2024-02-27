"use server";

import { auth, currentUser } from "@clerk/nextjs";
import { and, eq, gt, max, ne, sql } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { fromZodError } from "zod-validation-error";

import { type TaskFormType as CreateTaskData } from "~/components/backlog/create-task";
import { type StatefulTask, schemaValidators } from "~/config/TaskConfigType";
import { db } from "~/server/db";
import { tasks, users } from "~/server/db/schema";
import { type Task } from "~/server/db/schema";
import { throwServerError } from "~/utils/errors";

import {
	deleteViewsForTask,
	updateOrInsertTaskView,
} from "./task-views-actions";
import { createNotification } from "../notification-actions";

const CreateTaskSchema = z.object({
	title: schemaValidators.title,
	description: schemaValidators.description,
	status: schemaValidators.status,
	points: schemaValidators.points,
	priority: schemaValidators.priority,
	type: schemaValidators.type,
	assignee: schemaValidators.assignee.transform((val) =>
		val === "unassigned" ? null : val,
	),
	projectId: schemaValidators.projectId,
	sprintId: schemaValidators.sprintId.transform((val) => parseInt(val)),
	backlogOrder: schemaValidators.backlogOrder,
	boardOrder: schemaValidators.boardOrder,
});

export async function createTask(data: CreateTaskData) {
	try {
		const newTask = CreateTaskSchema.parse(data);

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
		} else {
			newTask.backlogOrder = 0;
			newTask.boardOrder = 0;
		}

		const task = await db.insert(tasks).values(newTask);

		if (newTask.assignee) {
			const assignee = await db
				.select()
				.from(users)
				.where(eq(users.username, newTask.assignee ?? ""))
				.limit(1);

			await createNotification({
				date: new Date(),
				message: `Task "${newTask.title}" was created and assigned to you.`,
				userId: assignee[0]?.userId ?? "unknown user",
				taskId: parseInt(task.insertId),
				projectId: newTask.projectId,
			});
		}

		revalidatePath("/");
	} catch (error) {
		if (error instanceof z.ZodError) {
			const validationError = fromZodError(error);
			if (validationError) throw Error(validationError.message);
		}
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

export async function updateTask(id: number, data: CreateTaskData) {
	try {
		const user = await currentUser();
		const updatedTaskData = CreateTaskSchema.parse(data);
		const currentTask = await db
			.select()
			.from(tasks)
			.where(eq(tasks.id, id));
		const currTask = currentTask[0];
		if (!currTask) return;
		if (updatedTaskData.assignee === "unassigned")
			updatedTaskData.assignee = null;
		else if (user?.username !== updatedTaskData.assignee) {
			const assignee = await db
				.select()
				.from(users)
				.where(eq(users.username, updatedTaskData.assignee ?? ""))
				.limit(1);

			await createNotification({
				date: new Date(),
				message: `Task "${updatedTaskData.title}" was assigned to you.`,
				userId: assignee[0]?.userId ?? "unknown user",
				taskId: id,
				projectId: updatedTaskData.projectId,
			});
		}

		const taskData = {
			...updatedTaskData,
			lastEditedAt: new Date(),
		};

		if (taskData.status === "backlog" && currTask.sprintId !== -1) {
			taskData.sprintId = -1;
		} else if (taskData.sprintId !== -1 && taskData.status === "backlog") {
			taskData.status = "todo";
		}
		await db.update(tasks).set(taskData).where(eq(tasks.id, id));
		revalidatePath("/");
	} catch (error) {
		if (error instanceof z.ZodError) {
			const validationError = fromZodError(error);
			if (validationError) throw Error(validationError.message);
		}
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
