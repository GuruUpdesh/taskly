"use server";

import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { db } from "~/server/db";
import { user, insertUserSchema } from "~/server/db/schema";
import { type User, type NewUser } from "~/server/db/schema";

export async function createUser(data: NewUser) {
	try {
		const newUser: NewUser = insertUserSchema.parse(data);
		await db.insert(user).values(newUser);
		revalidatePath("/");
	} catch (error) {
		if (error instanceof Error) console.log(error.stack);
	}
}

export async function getAllUsers() {
	try {
		const allUsers: User[] = await db.select().from(user);
		return allUsers;
	} catch (error) {
		if (error instanceof Error) console.log(error.stack);
	}
}

export async function deleteUser(id: number) {
	try {
		await db.delete(user).where(eq(user.id, id));
		revalidatePath("/");
	} catch (error) {
		if (error instanceof Error) console.log(error.stack);
	}
}
