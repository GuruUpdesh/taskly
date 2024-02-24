/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import type {
	SessionWebhookEvent,
	UserJSON,
	UserWebhookEvent,
	WebhookEvent,
} from "@clerk/nextjs/server";
import { clerkClient } from "@clerk/nextjs";
import { eq } from "drizzle-orm";
import { headers } from "next/headers";
import { Webhook as svixWebhook } from "svix";
import { env } from "~/env.mjs";
import { db } from "~/server/db";
import { type NewUser, insertUserSchema, users } from "~/server/db/schema";
import { throwServerError } from "~/utils/errors";

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
async function onUserCreated(payload: UserWebhookEvent) {
	const data = payload.data as UserJSON;
	if (!data.id || !data.username || !data.image_url) {
		throwServerError("Required data not found in webhook payload");
		return;
	}

	await helperCreateUser(data.id, data.username, data.image_url);
}

async function helperCreateUser(
	userId: string,
	username: string,
	profilePicture: string,
) {
	const data: NewUser = {
		userId,
		username,
		profilePicture,
	};

	const newUser = insertUserSchema.parse(data);
	await db.insert(users).values(newUser);
}

async function onUserDeleted(payload: UserWebhookEvent) {
	const userId = payload.data.id;
	if (!userId) {
		throwServerError("No user ID provided");
		return;
	}
	await db.delete(users).where(eq(users.userId, userId));
}

async function onSessionCreated(payload: SessionWebhookEvent) {
	const userId = payload.data.user_id;

	// check if the user exists in our database
	const user = await db
		.selectDistinct()
		.from(users)
		.where(eq(users.userId, userId));

	// if not, create a new user
	if (user.length === 0) {
		const user = await clerkClient.users.getUser(userId);
		if (!user) {
			throwServerError("User not found");
			return;
		}
		if (!user.username) {
			throwServerError("User does not have a username");
			return;
		}
		if (!user.imageUrl) {
			throwServerError("User does not have a profile picture");
			return;
		}
		await helperCreateUser(userId, user.username, user.imageUrl);
	}
}

export async function POST(request: Request) {
	try {
		const payload = await validateRequest(request);
		console.log("Clerk Webhook Received >", payload.type);

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
			default:
				throwServerError("Unhandled webhook event");
		}

		return Response.json({ message: "Received" });
	} catch (e) {
		console.error(e);
		return new Response("Bad Request", {
			status: 404,
		});
	}
}
