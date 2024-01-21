"use server";

import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { db } from "~/server/db";
import { tasks, selectTaskSchema } from "~/server/db/schema";
import { type Task, type NewTask } from "~/server/db/schema";

export async function createTask(data: NewTask) {
	try {
		const newTask: NewTask = selectTaskSchema.parse(data);
		await db.insert(tasks).values(newTask);
		revalidatePath("/");
	} catch (error) {
		if (error instanceof Error) console.log(error.stack);
	}
}

export async function getAllTasks() {
	try {
		const allTasks: Task[] = await db.select().from(tasks);
		return allTasks;
	} catch (error) {
		if (error instanceof Error) console.log(error.stack);
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
		if (error instanceof Error) console.log(error.stack);
	}
}

export async function deleteTask(id: number) {
	try {
		await db.delete(tasks).where(eq(tasks.id, id));
		revalidatePath("/");
	} catch (error) {
		if (error instanceof Error) console.log(error.stack);
	}
}

export async function updateTask(id: number, data: NewTask) {
	try {
		const updatedTaskData: NewTask = selectTaskSchema.parse(data);
		await db.update(tasks).set(updatedTaskData).where(eq(tasks.id, id));
		revalidatePath("/");
	} catch (error) {
		if (error instanceof Error) console.log(error.stack);
	}
}
