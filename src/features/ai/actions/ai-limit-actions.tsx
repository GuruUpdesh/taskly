"use server";

import { auth } from "@clerk/nextjs/server";
import { kv } from "@vercel/kv";
import { eq } from "drizzle-orm";
import { z } from "zod";

import { db } from "~/db";
import { AIDAILYLIMIT } from "~/features/ai/utils/aiLimit";
import { logger } from "~/lib/logger";
import { users } from "~/schema";

// UserAiLimitSchema
const UserAiLimitSchema = z.object({
	count: z.number(),
});

export async function isAiLimitReached() {
	const { userId } = await auth();
	const childLogger = logger.child({ userId });

	if (!userId) {
		childLogger.error("[AI] Limit userId not found");
		return true;
	}

	childLogger.info("[AI] Limit check");

	const userResults = await db
		.select()
		.from(users)
		.where(eq(users.userId, userId))
		.limit(1);

	const user = userResults[0];
	if (!user) {
		logger.error("[AI] Limit user not found");
		return true;
	}

	const data = await kv.get(user.userId + "aiDailyLimit");
	if (!data) {
		logger.debug("[AI] [Redis] Value not found, setting to 0");
		await kv.set(user.userId + "aiDailyLimit", { count: 0 });
		return false;
	}

	const parsedData = UserAiLimitSchema.parse(data);
	if (parsedData.count >= AIDAILYLIMIT) {
		logger.debug(`[AI] Limit Reached! ${parsedData.count}/${AIDAILYLIMIT}`);
		return true;
	}

	await kv.set(user.userId + "aiDailyLimit", { count: parsedData.count + 1 });
	logger.debug(
		`[AI] Limit incremented ${parsedData.count + 1}/${AIDAILYLIMIT}`,
	);
	return false;
}

export async function getAiLimitCount() {
	const { userId } = await auth();
	if (!userId) {
		logger.error("[AI] Get Limit no userId found!");
		return 0;
	}

	const userResults = await db
		.select()
		.from(users)
		.where(eq(users.userId, userId))
		.limit(1);

	const user = userResults[0];
	if (!user) {
		logger.error("[AI] Get Limit no user found!");
		return 0;
	}

	const data = await kv.get(user.userId + "aiDailyLimit");
	if (!data) {
		logger.debug("[AI] [Redis] Get Limit not found, setting to 0");
		await kv.set(user.userId + "aiDailyLimit", { count: 0 });
		return 0;
	}

	const parsedData = UserAiLimitSchema.parse(data);
	logger.info({ userId, limit: parsedData.count }, "[AI] Get Limit");
	return parsedData.count;
}
