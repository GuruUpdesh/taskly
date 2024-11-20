import { clerkClient, type WebhookEvent } from "@clerk/nextjs/server";
import { eq } from "drizzle-orm";
import { headers } from "next/headers";
import { Webhook as svixWebhook } from "svix";

import { db } from "~/db";
import { env } from "~/env.mjs";
import { logger } from "~/lib/logger";
import { type NewUser, insertUserSchema, users, tasks } from "~/schema";

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
		logger.error(
			`[CLERK WEBHOOK] onUserCreated > Invalid payload type (${payload.type}) expected user.created`,
		);
		return;
	}

	const data = payload.data;

	if (!data.id || !data.username || !data.image_url) {
		logger.error(
			"[CLERK WEBHOOK] onUserCreated > Required data not found in webhook payload",
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
	logger.info(`[CLERK WEBHOOK] Creating user > ${username} (${userId})`);
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
		logger.error(
			`[CLERK WEBHOOK] onUserDeleted > Invalid payload type (${payload.type}) expected user.deleted`,
		);
		return;
	}

	const userId = payload.data.id;

	if (!userId) {
		logger.error("[CLERK WEBHOOK] onUserDeleted > No user ID provided");
		return;
	}

	await db.delete(users).where(eq(users.userId, userId));
}

async function onSessionCreated(payload: WebhookEvent) {
	if (payload.type !== "session.created") {
		logger.error(
			`[CLERK WEBHOOK] onSessionCreated > Invalid payload type (${payload.type}) expected session.created`,
		);
		return;
	}

	const userId = payload.data.user_id;
	if (!userId) {
		logger.error("[CLERK WEBHOOK] onSessionCreated > No user ID provided");
		return;
	}

	// check if the user exists in our database
	const user = await db
		.selectDistinct()
		.from(users)
		.where(eq(users.userId, userId));

	const client = await clerkClient();
	// if not, create a new user
	if (user.length === 0) {
		const user = await client.users.getUser(userId);
		if (!user) {
			logger.error("[CLERK WEBHOOK] onSessionCreated > User not found");
			return;
		}
		if (!user.username) {
			logger.error(
				"[CLERK WEBHOOK] onSessionCreated > User does not have a username",
			);
			return;
		}
		if (!user.imageUrl) {
			logger.error(
				"[CLERK WEBHOOK] onSessionCreated > User does not have a profile picture",
			);
			return;
		}
		await helperCreateUser(userId, user.username, user.imageUrl);
	} else if (user[0]) {
		// check that the username still matches
		const clerkUser = await client.users.getUser(userId);
		if (!clerkUser.username) {
			logger.error(
				"[CLERK WEBHOOK] onSessionCreated > User does not have a username",
			);
			return;
		}

		// if not update the username
		if (clerkUser.username !== user[0].username) {
			logger.info("[CLERK WEBHOOK] updating username");
			await db
				.update(users)
				.set({ username: clerkUser.username })
				.where(eq(users.userId, userId));
		}
	}
}
async function onUserUpdated(payload: WebhookEvent) {
	if (payload.type !== "session.created") {
		logger.error(
			`[CLERK WEBHOOK] onUserUpdated > Invalid payload type (${payload.type}) expected session.created`,
		);
		return;
	}

	const userId = payload.data.user_id;
	if (!userId) {
		logger.error("[CLERK WEBHOOK] onUserUpdated > No user ID provided");
		return;
	}

	const client = await clerkClient();
	const clerkUser = await client.users.getUser(userId);

	if (!clerkUser) {
		logger.error("[CLERK WEBHOOK] onUserUpdated > User not found");
		return;
	}

	if (!clerkUser.username) {
		logger.error(
			"[CLERK WEBHOOK] onUserUpdated > User does not have a username",
		);
		return;
	}

	if (!clerkUser.imageUrl) {
		logger.error(
			"[CLERK WEBHOOK] onUserUpdated > User does not have a profile picture",
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
		logger.info({ payload: payload.type }, "[CLERK WEBHOOK] ");

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
				logger.error("[CLERK WEBHOOK] Unhandled webhook event");
		}

		return Response.json({ message: "Received" });
	} catch (e) {
		logger.error(e);
		return new Response("Bad Request", {
			status: 404,
		});
	}
}
