import { sql } from "drizzle-orm";
import { z } from "zod";

import { db } from "~/db";
import { env } from "~/env.mjs";
import { users } from "~/schema";

import { logger } from "./lib/logger";

const clerkUserSchema = z.object({
	id: z.string(),
	username: z.string(),
	image_url: z.string(),
});

const dataSchema = z.array(clerkUserSchema);

export async function register() {
	const clerkSecretKeys = [
		env.CLERK_SECRET_KEY,
		env.CLERK_PROD_SECRET_KEY,
	].filter((key) => key !== undefined);

	type Users = {
		userId: string;
		username: string;
		profilePicture: string;
	}[];
	const untrackedUsers: Users = [];

	for (const key of clerkSecretKeys) {
		if (key === undefined) {
			throw new Error("Clerk secret key is not defined");
		}
		if (env.NODE_ENV !== "development") {
			return;
		}

		const result = await fetch("https://api.clerk.com/v1/users?limit=500", {
			method: "GET",
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${key}`,
			},
		});

		if (result.status !== 200) {
			throw new Error("Failed to fetch users from Clerk");
		}

		const data = (await result.json()) as unknown;
		const returnData = dataSchema.parse(data);

		const usersData = returnData.map((user) => ({
			userId: user.id,
			username: user.username,
			profilePicture: user.image_url,
		}));
		untrackedUsers.push(...usersData);
		logger.info(`Inserting ${usersData.length} users into the database`);
	}

	await db
		.insert(users)
		.values(untrackedUsers)
		.onConflictDoUpdate({
			target: users.userId,
			set: { username: sql`excluded.username` },
		});
}
