"use server";

import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { db } from "~/server/db";
import { task, insertTaskSchema } from "~/server/db/schema";
import { type Task, type NewTask } from "~/server/db/schema";

export async function createTask(data: NewTask) {
	try {
		const newTask: NewTask = insertTaskSchema.parse(data);
		await db.insert(task).values(newTask);
		revalidatePath("/");
	} catch (error) {
		if (error instanceof Error) console.log(error.stack);
	}
}

export async function getAllTasks() {
	try {
		const allTasks: Task[] = await db.select().from(task);
		return allTasks;
	} catch (error) {
		if (error instanceof Error) console.log(error.stack);
	}
}

export async function deleteTask(id: number) {
	try {
		await db.delete(task).where(eq(task.id, id));
		revalidatePath("/");
	} catch (error) {
		if (error instanceof Error) console.log(error.stack);
	}
}

export async function updateTask(id: number, data: NewTask) {
	try {
		const updatedTaskData: NewTask = insertTaskSchema.parse(data);
		await db.update(task)
			 .set(updatedTaskData)
			 .where(eq(task.id, id));
		// console.log("updated task");
		revalidatePath("/");
	} catch (error) {
		if (error instanceof Error) console.log(error.stack);
	}
}
