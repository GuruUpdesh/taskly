"use server";

import { auth } from "@clerk/nextjs/server";
import { kv } from "@vercel/kv";
import { eq } from "drizzle-orm";
import { z } from "zod";

import { AIDAILYLIMIT } from "~/config/aiLimit";
import { db } from "~/server/db";
import { users } from "~/server/db/schema";

// UserAiLimitSchema
const UserAiLimitSchema = z.object({
	count: z.number(),
});

export async function isAiLimitReached() {
	console.log("Checking if AI limit is reached...");
	const { userId } = auth();
	if (!userId) {
		console.log("No user ID found.");
		return true;
	}

	const userResults = await db
		.select()
		.from(users)
		.where(eq(users.userId, userId))
		.limit(1);

	const user = userResults[0];
	if (!user) {
		console.log("No user found.");
		return true;
	}

	const data = await kv.get(user.userId + "aiDailyLimit");
	if (!data) {
		console.log("No data found. Setting count to 0.");
		await kv.set(user.userId + "aiDailyLimit", { count: 0 });
		return false;
	}

	const parsedData = UserAiLimitSchema.parse(data);
	if (parsedData.count >= AIDAILYLIMIT) {
		console.log("AI daily limit reached.");
		return true;
	}

	await kv.set(user.userId + "aiDailyLimit", { count: parsedData.count + 1 });
	console.log("AI daily limit not reached.");
	return false;
}

export async function getAiLimitCount() {
	const { userId } = auth();
	if (!userId) {
		console.log("No user ID found.");
		return 0;
	}

	const userResults = await db
		.select()
		.from(users)
		.where(eq(users.userId, userId))
		.limit(1);

	const user = userResults[0];
	if (!user) {
		console.log("No user found.");
		return 0;
	}

	const data = await kv.get(user.userId + "aiDailyLimit");
	if (!data) {
		console.log("No data found. Setting count to 0.");
		await kv.set(user.userId + "aiDailyLimit", { count: 0 });
		return 0;
	}

	const parsedData = UserAiLimitSchema.parse(data);
	console.log("AI limit count:", parsedData.count);
	return parsedData.count;
}
