import { clerkClient, type WebhookEvent } from "@clerk/nextjs/server";
import { eq } from "drizzle-orm";
import { headers } from "next/headers";
import { Webhook as svixWebhook } from "svix";

import { env } from "~/env.mjs";
import { db } from "~/server/db";
import {
	type NewUser,
	insertUserSchema,
	users,
	tasks,
} from "~/server/db/schema";

const webhookSecret = env.CLERK_WEBHOOK_SECRET;

/**
 * This function is taken from the Clerk docs
 * https://clerk.com/blog/webhooks-getting-started
 *
 * It is used for security purposes to ensure that the request is coming from Clerk
 */
async function validateRequest(request: Request) {
	const payloadString = await request.text();
	const headerPayload = headers();

	const svixHeaders = {
		"svix-id": headerPayload.get("svix-id")!,
		"svix-timestamp": headerPayload.get("svix-timestamp")!,
		"svix-signature": headerPayload.get("svix-signature")!,
	};
	// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
	const wh: svixWebhook = new svixWebhook(webhookSecret);
	return wh.verify(payloadString, svixHeaders) as WebhookEvent;
}

/**
 * Now we can handle the webhook events with our own logic
 */
async function onUserCreated(payload: WebhookEvent) {
	if (payload.type !== "user.created") {
		console.error(
			`🪩 Clerk Webhook: onUserCreated > Invalid payload type (${payload.type}) expected user.created`,
		);
		return;
	}

	const data = payload.data;

	if (!data.id || !data.username || !data.image_url) {
		console.error(
			"🪩 Clerk Webhook: onUserCreated > Required data not found in webhook payload",
		);
		return;
	}

	await helperCreateUser(data.id, data.username, data.image_url);
}

async function helperCreateUser(
	userId: string,
	username: string,
	profilePicture: string,
) {
	console.log(`🪩 Clerk Webhook: Creating user > ${username} (${userId})`);
	const data: NewUser = {
		userId,
		username,
		profilePicture,
	};
	const newUser = insertUserSchema.parse(data);
	await db.insert(users).values(newUser);
}

async function onUserDeleted(payload: WebhookEvent) {
	if (payload.type !== "user.deleted") {
		console.error(
			`🪩 Clerk Webhook: onUserDeleted > Invalid payload type (${payload.type}) expected user.deleted`,
		);
		return;
	}

	const userId = payload.data.id;

	if (!userId) {
		console.error("Clerk Webhook: onUserDeleted > No user ID provided");
		return;
	}

	await db.delete(users).where(eq(users.userId, userId));
}

async function onSessionCreated(payload: WebhookEvent) {
	if (payload.type !== "session.created") {
		console.error(
			`🪩 Clerk Webhook: onSessionCreated > Invalid payload type (${payload.type}) expected session.created`,
		);
		return;
	}

	const userId = payload.data.user_id;
	if (!userId) {
		console.error(
			"🪩 Clerk Webhook: onSessionCreated > No user ID provided",
		);
		return;
	}

	// check if the user exists in our database
	const user = await db
		.selectDistinct()
		.from(users)
		.where(eq(users.userId, userId));

	// if not, create a new user
	if (user.length === 0) {
		const user = await clerkClient.users.getUser(userId);
		if (!user) {
			console.error(
				"🪩 Clerk Webhook: onSessionCreated > User not found",
			);
			return;
		}
		if (!user.username) {
			console.error(
				"🪩 Clerk Webhook: onSessionCreated > User does not have a username",
			);
			return;
		}
		if (!user.imageUrl) {
			console.error(
				"🪩 Clerk Webhook: onSessionCreated > User does not have a profile picture",
			);
			return;
		}
		await helperCreateUser(userId, user.username, user.imageUrl);
	} else if (user[0]) {
		// check that the username still matches
		const clerkUser = await clerkClient.users.getUser(userId);
		if (!clerkUser.username) {
			console.error(
				"🪩 Clerk Webhook: onSessionCreated > User does not have a username",
			);
			return;
		}

		// if not update the username
		if (clerkUser.username !== user[0].username) {
			console.log("🪩 Clerk Webhook: updating username");
			await db
				.update(users)
				.set({ username: clerkUser.username })
				.where(eq(users.userId, userId));
		}
	}
}
async function onUserUpdated(payload: WebhookEvent) {
	if (payload.type !== "session.created") {
		console.error(
			`🪩 Clerk Webhook: onUserUpdated > Invalid payload type (${payload.type}) expected session.created`,
		);
		return;
	}

	const userId = payload.data.user_id;
	if (!userId) {
		console.error("🪩 Clerk Webhook: onUserUpdated > No user ID provided");
		return;
	}

	const clerkUser = await clerkClient.users.getUser(userId);

	if (!clerkUser) {
		console.error("🪩 Clerk Webhook: onUserUpdated > User not found");
		return;
	}

	if (!clerkUser.username) {
		console.error(
			"🪩 Clerk Webhook: onUserUpdated > User does not have a username",
		);
		return;
	}

	if (!clerkUser.imageUrl) {
		console.error(
			"🪩 Clerk Webhook: onUserUpdated > User does not have a profile picture",
		);
		return;
	}

	// get current username
	const user = await db.select().from(users).where(eq(users.userId, userId));

	if (user.length === 0) {
		await helperCreateUser(userId, clerkUser.username, clerkUser.imageUrl);
		return;
	}

	if (!user[0]) {
		return;
	}

	// if the username has changed we need to update all tasks where assignee = username
	await db
		.update(tasks)
		.set({ assignee: clerkUser.username })
		.where(eq(tasks.assignee, user[0].username));

	await db
		.update(users)
		.set({
			username: clerkUser.username,
			profilePicture: clerkUser.imageUrl,
		})
		.where(eq(users.userId, userId));
}

export async function POST(request: Request) {
	try {
		const payload = await validateRequest(request);
		console.log("🪩 Clerk Webhook: ", payload.type);

		switch (payload.type) {
			case "user.created":
				await onUserCreated(payload);
				break;
			case "user.deleted":
				await onUserDeleted(payload);
				break;
			case "session.created":
				await onSessionCreated(payload);
				break;
			case "user.updated":
				await onUserUpdated(payload);
			default:
				console.error("🪩 Clerk Webhook: Unhandled webhook event");
		}

		return Response.json({ message: "Received" });
	} catch (e) {
		console.error(e);
		return new Response("Bad Request", {
			status: 404,
		});
	}
}
