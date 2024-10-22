"use server";

import { auth, currentUser } from "@clerk/nextjs/server";
import { and, eq, gt, max, ne, sql } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { fromZodError } from "zod-validation-error";

import { createNotification } from "~/actions/notification-actions";
import { type TaskFormType as CreateTaskData } from "~/app/components/CreateTask";
import {
	type StatefulTask,
	CreateTaskSchema,
	getPropertyConfig,
} from "~/config/taskConfigType";
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

import { getCurrentSprintForProject } from "./sprint-actions";
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
		comment: `created the task`,
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
	try {
		// validation
		const requestedUpdates = CreateTaskSchema.partial().parse(data);
		if (Object.keys(requestedUpdates).length === 0) {
			console.warn("No data to update");
			return;
		}

		// find existing task
		const existingTask = await db.query.tasks.findFirst({
			where: (tasks) => eq(tasks.id, id),
		});
		if (!existingTask) {
			console.error(`Failed to fetch existing task ${id}`);
			return;
		}

		// get the proposed task object
		const requestedTask = {
			...existingTask,
			...requestedUpdates,
			lastEditedAt: new Date(),
		};

		// get the current sprint in case of auto changes
		const sprint = await getCurrentSprintForProject(
			requestedTask.projectId,
		);

		if (requestedUpdates.status !== undefined) {
			if (
				requestedTask.sprintId === -1 &&
				requestedTask.status !== "backlog" &&
				sprint
			) {
				requestedTask.sprintId = sprint.id;
			} else if (requestedTask.sprintId !== -1) {
				requestedTask.sprintId = -1;
			}
		}

		if (requestedUpdates.sprintId !== undefined) {
			if (
				requestedTask.sprintId !== -1 &&
				requestedTask.status === "backlog"
			) {
				requestedTask.status = "todo";
			} else if (requestedTask.sprintId === -1) {
				requestedTask.status = "backlog";
			}
		}

		await db.update(tasks).set(requestedTask).where(eq(tasks.id, id));

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
			if (
				user?.username === task.assignee ||
				!task.assignee ||
				!validatedValues?.propertyKey
			) {
				console.log("Skipping notification");
				return;
			}

			const config = getPropertyConfig(validatedValues.propertyKey);
			const assignedUser = await db
				.select()
				.from(users)
				.where(eq(users.username, task.assignee));
			if (assignedUser.length === 0 || !assignedUser[0]) {
				console.log("Skipping notification");
				return;
			}

			await createNotification({
				date: new Date(),
				message: `${user.username} changed ${config.displayName} to ${validatedValues.propertyValue}`,
				userId: assignedUser[0].userId,
				taskId: taskId,
				projectId: task.projectId,
			});
		}
	});

	revalidatePath("/");
}

export async function getTask(id: number) {
	try {
		const { userId }: { userId: string | null } = auth();
		if (!userId) {
			return { data: null, error: "UserId not found" };
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
			return { data: null, error: `Task ${id} not found` };
		}
		if (!taskQuery.project.usersToProjects.length) {
			return {
				data: null,
				error: "You don't have permission to view this task",
			};
		}

		await updateOrInsertTaskView(id, userId);

		return { data: taskQuery, error: null };
	} catch (error) {
		console.error(error);
		if (error instanceof Error) {
			return { data: null, error: error.message };
		}
		return { data: null, error: "An unknown error occurred" };
	}
}
