"use server";

import { eq } from "drizzle-orm";

import { authenticate } from "~/actions/security/authenticate";
import { db } from "~/server/db";
import { type User } from "~/server/db/schema";

type GetUserSuccess = {
	success: true;
	message: string;
	user: User;
};

type GetUserFailure = {
	success: false;
	message: string;
};

export type GetUserResponse = GetUserSuccess | GetUserFailure;

export async function getUser(): Promise<GetUserResponse> {
	const userId = authenticate();
	if (!userId) {
		return { success: false, message: "User not authenticated" };
	}

	const user = await db.query.users.findFirst({
		where: (user) => eq(user.userId, userId),
	});

	if (!user) {
		return { success: false, message: "User not found" };
	}

	return { success: true, message: "User found", user };
}
