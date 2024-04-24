"use server";

import { auth, currentUser } from "@clerk/nextjs/server";
import { and, eq, gt, max, ne, sql } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { fromZodError } from "zod-validation-error";

import { createNotification } from "~/actions/notification-actions";
import { type TaskFormType as CreateTaskData } from "~/components/backlog/create-task";
import { type StatefulTask, CreateTaskSchema } from "~/config/taskConfigType";
import { db } from "~/server/db";
import {
	comments,
	insertTaskHistorySchema,
	notifications,
	taskHistory,
	tasks,
	tasksToViews,
	users,
} from "~/server/db/schema";
import { type Task } from "~/server/db/schema";
import { throwServerError } from "~/utils/errors";
import { taskNameToBranchName } from "~/utils/task-name-branch-converters";

import {
	deleteViewsForTask,
	updateOrInsertTaskView,
} from "./task-views-actions";

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

		newTask.branchName = taskNameToBranchName(newTask.title);

		const task = await db.insert(tasks).values(newTask).returning();

		if (task[0]) {
			void createTaskCreateNotification(task[0].id, newTask);
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

async function createTaskCreateNotification(
	taskId: number,
	newTask: z.infer<typeof CreateTaskSchema>,
) {
	const user = await currentUser();
	if (!user?.username) return;

	const assignee = await db
		.select()
		.from(users)
		.where(eq(users.username, newTask.assignee ?? ""))
		.limit(1);

	await db.insert(taskHistory).values({
		taskId: taskId,
		propertyKey: "assignee",
		propertyValue: user.username,
		comment: `created the task.`,
		userId: user.id,
		insertedDate: new Date(),
	});

	await createNotification({
		date: new Date(),
		message: `Task "${newTask.title}" was created and assigned to you.`,
		userId: assignee[0]?.userId ?? "unassigned",
		taskId: taskId,
		projectId: newTask.projectId,
	});
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

export async function getAllActiveTasksForProject(projectId: number) {
	try {
		const allTasks: Task[] = await db
			.select()
			.from(tasks)
			.where(
				and(
					eq(tasks.projectId, projectId),
					ne(tasks.status, "todo"),
					ne(tasks.status, "inprogress"),
					ne(tasks.status, "done"),
				),
			);

		return allTasks;
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
			await tx.delete(notifications).where(eq(notifications.taskId, id));
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
			await tx.delete(comments).where(eq(comments.taskId, id));
			await tx.delete(taskHistory).where(eq(taskHistory.taskId, id));
			await tx.delete(tasksToViews).where(eq(tasksToViews.taskId, id));
		});

		await db.delete(tasks).where(eq(tasks.id, id));

		void deleteViewsForTask(id);
		revalidatePath("/");
	} catch (error) {
		if (error instanceof Error) throwServerError(error.message);
	}
}

export type UpdateTaskData = Partial<CreateTaskData>;
export async function updateTask(
	id: number,
	data: UpdateTaskData,
	waitForNotification = false,
) {
	console.time("update task");
	try {
		const updatedTaskData = CreateTaskSchema.partial().parse(data);
		if (Object.keys(updatedTaskData).length === 0) {
			console.warn("No data to update");
			return;
		}

		const taskData = {
			...updatedTaskData,
			lastEditedAt: new Date(),
		};

		if (
			updatedTaskData.status === "backlog" &&
			updatedTaskData.sprintId !== -1
		) {
			updatedTaskData.sprintId = -1;
		} else if (
			updatedTaskData.sprintId !== -1 &&
			updatedTaskData.status === "backlog"
		) {
			updatedTaskData.status = "todo";
		}

		if (!taskData) return;
		const existingTask = await db.query.tasks.findFirst({
			where: (tasks) => eq(tasks.id, id),
		});
		if (!existingTask) return;
		await db.update(tasks).set(taskData).where(eq(tasks.id, id));
		if (waitForNotification) {
			await createTaskUpdateNotification(id, data, existingTask);
			revalidatePath("/");
		} else {
			void createTaskUpdateNotification(id, data, existingTask);
		}
	} catch (error) {
		if (error instanceof z.ZodError) {
			const validationError = fromZodError(error);
			if (validationError) throw Error(validationError.message);
		}
		if (error instanceof Error) throwServerError(error.message);
	}
	console.timeEnd("update task");
}

async function createTaskUpdateNotification(
	taskId: number,
	taskData: UpdateTaskData,
	existingTask: Task,
) {
	const user = await currentUser();
	if (!user) return;

	const task = await db.query.tasks.findFirst({
		where: (tasks) => eq(tasks.id, taskId),
	});
	if (!task) return;

	taskData.sprintId = String(taskData.sprintId);
	if (taskData.assignee === null) {
		taskData.assignee = "unassigned";
	}

	const existingTaskTransformed = {
		...existingTask,
		sprintId: String(existingTask.sprintId),
	};
	if (existingTaskTransformed.assignee === null) {
		existingTaskTransformed.assignee = "unassigned";
	}

	await db.transaction(async (tx) => {
		for (const key in taskData) {
			const value = taskData[key as keyof typeof taskData];
			const excludedKeys = [
				"lastEditedAt",
				"insertedDate",
				"boardOrder",
				"backlogOrder",
				"id",
				"title",
				"description",
			];
			if (value === undefined || excludedKeys.includes(key)) continue;

			if (
				Object.keys(taskData).length > 1 &&
				(key === "sprintId" ||
					(key === "assignee" &&
						value === "unassigned" &&
						Object.keys(taskData).length !== 2))
			) {
				continue;
			}

			const values = {
				taskId: taskId,
				propertyKey: key,
				propertyValue: String(value),
				oldPropertyValue: String(
					existingTaskTransformed[key as keyof Task],
				),
				userId: user.id,
				insertedDate: new Date(),
			};

			const validatedValues = insertTaskHistorySchema.parse(values);

			await tx.insert(taskHistory).values(validatedValues);
		}
	});

	revalidatePath("/");

	if (user?.username === task.assignee || task.assignee === null) return;

	await createNotification({
		date: new Date(),
		message: `Task was updated.`,
		userId: user.id,
		taskId: taskId,
		projectId: task.projectId,
	});
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
				taskHistory: {
					with: {
						user: true,
					},
				},
				comments: {
					with: {
						user: true,
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
