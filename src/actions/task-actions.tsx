"use server";

import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { db } from "~/server/db";
import { tasks, insertTaskSchema__required } from "~/server/db/schema";
import { type Task, type NewTask } from "~/server/db/schema";
import { throwServerError } from "~/utils/errors";

export async function createTask(data: NewTask) {
	try {
		const newTask = insertTaskSchema__required.parse(data);
		await db.insert(tasks).values(newTask);
		revalidatePath("/");
	} catch (error) {
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

		return allTasks;
	} catch (error) {
		if (error instanceof Error) throwServerError(error.message);
	}
}

export async function deleteTask(id: number) {
	try {
		await db.delete(tasks).where(eq(tasks.id, id));
		revalidatePath("/");
	} catch (error) {
		if (error instanceof Error) throwServerError(error.message);
	}
}

export async function updateTask(id: number, data: NewTask) {
	try {
		const updatedTaskData: NewTask = insertTaskSchema__required.parse(data);
		await db.update(tasks).set(updatedTaskData).where(eq(tasks.id, id));
		revalidatePath("/");
	} catch (error) {
		if (error instanceof Error) throwServerError(error.message);
	}
}
