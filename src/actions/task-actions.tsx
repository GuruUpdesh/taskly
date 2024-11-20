"use server";

import { auth, currentUser } from "@clerk/nextjs/server";
import { and, eq, gt, max, ne, sql } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { fromZodError } from "zod-validation-error";

import { db } from "~/db";
import { createNotification } from "~/features/notifications/actions/notification-actions";
import { type TaskFormType as CreateTaskData } from "~/features/tasks/components/CreateTask";
import {
	type StatefulTask,
	CreateTaskSchema,
} from "~/features/tasks/config/taskConfigType";
import { createTaskHistory } from "~/features/tasks/history/create-task-history";
import { normalizeTaskSprintStatus } from "~/features/tasks/utils/normalizeTaskSprintStatus";
import { taskNameToBranchName } from "~/features/tasks/utils/task-name-branch-converters";
import { logger } from "~/lib/logger";
import { taskHistory, tasks, users } from "~/schema";
import { type Task } from "~/schema";
import { throwServerError } from "~/utils/errors";

import { authenticate } from "./security/authenticate";
import { checkPermissions } from "./security/permissions";
import { getCurrentSprintForProject } from "./sprint-actions";
import { updateOrInsertTaskView } from "./task-views-actions";

export async function createTask(data: CreateTaskData) {
	try {
		const userId = await authenticate();
		await checkPermissions(userId, data.projectId);

		const childLogger = logger.child({ data, userId });

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
		} else {
			newTask.backlogOrder = 0;
		}

		newTask.branchName = taskNameToBranchName(newTask.title);

		const sprint = await getCurrentSprintForProject(newTask.projectId);

		const normalizedNewTask = normalizeTaskSprintStatus(
			newTask,
			sprint?.id ?? -1,
		);

		childLogger.debug(normalizedNewTask, "[TASK] Create normalized task");

		const task = await db
			.insert(tasks)
			.values(normalizedNewTask)
			.returning();

		if (task[0]) {
			void createTaskCreateNotification(task[0].id, newTask);
			revalidatePath("/");

			return task[0];
		}
	} catch (error) {
		if (error instanceof z.ZodError) {
			const validationError = fromZodError(error);
			if (validationError) throw Error(validationError.message);
		}
		logger.error(error);
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
		comment: `Created the task`,
		userId: user.id,
		insertedDate: new Date(),
	});

	await createNotification({
		date: new Date(),
		message: `was created and assigned to you.`,
		userId: assignee[0]?.userId ?? "unassigned",
		taskId: taskId,
		projectId: newTask.projectId,
	});
}

export async function getTasksFromProject(projectId: number) {
	try {
		const userId = await authenticate();
		await checkPermissions(userId, projectId);

		logger.info({ userId, projectId }, "[TASK] Get all");

		const allTasks = await db.query.tasks.findMany({
			where: (tasks) => eq(tasks.projectId, projectId),
			with: {
				comments: {},
			},
		});

		const statefulTasks: StatefulTask[] = allTasks.map((task) => {
			const { comments, ...taskWithoutComments } = task;
			return {
				...taskWithoutComments,
				options: {},
				comments: comments.length,
			};
		});

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
		const userId = await authenticate();

		const childLogger = logger.child({ id, userId });
		childLogger.info("[TASK] Delete");

		const task = await db.query.tasks.findFirst({
			where: (tasks) => eq(tasks.id, id),
		});
		if (!task) {
			childLogger.error("[TASK] Delete cannot found task");
			return;
		}

		await checkPermissions(userId, task.projectId);

		// update backlogOrder of the tasks
		await db
			.update(tasks)
			.set({ backlogOrder: sql`${tasks.backlogOrder} - 1` })
			.where(
				and(
					eq(tasks.projectId, task.projectId),
					gt(tasks.backlogOrder, task.backlogOrder),
					ne(tasks.id, id),
				),
			);

		await db.delete(tasks).where(eq(tasks.id, id));

		revalidatePath("/");
	} catch (error) {
		logger.error(error, "[TASK] Delete");
	}
}

export type UpdateTaskData = Partial<CreateTaskData>;
export async function updateTask(id: number, data: UpdateTaskData) {
	try {
		const userId = await authenticate();
		const childLogger = logger.child({ id, data, userId });

		// validation
		const requestedUpdates = CreateTaskSchema.partial().parse(data);
		if (Object.keys(requestedUpdates).length === 0) {
			childLogger.warn("[TASK] Update requested no changes!");
			return;
		}

		// find existing task
		const existingTask = await db.query.tasks.findFirst({
			where: (tasks) => eq(tasks.id, id),
		});

		if (!existingTask) {
			childLogger.error("[TASK] Update current task not found!");
			return;
		}

		await checkPermissions(userId, existingTask.projectId);

		// get the proposed task object
		const requestedTask = {
			...existingTask,
			...requestedUpdates,
			lastEditedAt: new Date(),
		};

		// normalize the sprint and status
		const sprint = await getCurrentSprintForProject(
			requestedTask.projectId,
		);

		const normalizedUpdates = normalizeTaskSprintStatus(
			existingTask,
			sprint?.id ?? -1,
			requestedTask,
		);

		logger.info(
			{
				normalized: {
					status: normalizedUpdates.status,
					sprintId: normalizedUpdates.sprintId,
				},
			},
			"[TASK] Update normalized",
		);

		await db.update(tasks).set(normalizedUpdates).where(eq(tasks.id, id));

		await createTaskHistory(id, data, existingTask);
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
		const { userId }: { userId: string | null } = await auth();
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
				views: {
					where: (view) => eq(view.userId, userId),
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
		logger.error(error);
		if (error instanceof Error) {
			return { data: null, error: error.message };
		}
		return { data: null, error: "An unknown error occurred" };
	}
}
