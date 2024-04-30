import { z } from "zod";

import { env } from "~/env.mjs";
import { db } from "~/server/db";
import { users } from "~/server/db/schema";

const clerkUserSchema = z.object({
	id: z.string(),
	username: z.string().nullable(),
	image_url: z.string(),
});

const dataSchema = z.array(clerkUserSchema);

export async function register() {
	if (env.NODE_ENV !== "development") {
		return;
	}
	const result = await fetch("https://api.clerk.com/v1/users?limit=500", {
		method: "GET",
		headers: {
			"Content-Type": "application/json",
			Authorization: `Bearer ${env.CLERK_SECRET_KEY}`,
		},
	});

	if (result.status !== 200) {
		throw new Error("Failed to fetch users from Clerk");
	}

	const data = (await result.json()) as unknown;

	const returnData = dataSchema.parse(data);

	const usersData = returnData.map((user) => ({
		userId: user.id,
		username: user.username ?? "unknown",
		profilePicture: user.image_url,
	}));

	await db.delete(users);

	await db.insert(users).values(usersData);
}
