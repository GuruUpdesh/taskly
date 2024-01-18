/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import type {
	SessionWebhookEvent,
	UserWebhookEvent,
	WebhookEvent,
} from "@clerk/nextjs/server";
import { eq } from "drizzle-orm";
import { headers } from "next/headers";
import { Webhook as svixWebhook } from "svix";
import { env } from "~/env.mjs";
import { db } from "~/server/db";
import {
	type NewUserInfo,
	insertUserInfoSchema,
	userInfo,
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
async function onUserCreated(payload: UserWebhookEvent) {
	if (!payload.data.id) {
		throw new Error("No user ID provided");
	}

	await helperCreateUser(payload.data.id);
}

async function helperCreateUser(userId: string) {
	const data: NewUserInfo = {
		userId,
	};

	const newUserInfo: NewUserInfo = insertUserInfoSchema.parse(data);
	await db.insert(userInfo).values(newUserInfo);
}

async function onUserDeleted(payload: UserWebhookEvent) {
	const userId = payload.data.id;
	if (!userId) {
		throw new Error("No user ID provided");
	}
	await db.delete(userInfo).where(eq(userInfo.userId, userId));
}

async function onSessionCreated(payload: SessionWebhookEvent) {
	const userId = payload.data.user_id;

	// check if the user exists in our database
	const user = await db
		.selectDistinct()
		.from(userInfo)
		.where(eq(userInfo.userId, userId));

	// if not, create a new user
	if (user.length === 0) {
		await helperCreateUser(userId);
	}
}

export async function POST(request: Request) {
	try {
		const payload = await validateRequest(request);
		console.log(payload);

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
				throw new Error("Unhandled webhook event");
		}

		return Response.json({ message: "Received" });
	} catch (e) {
		console.error(e);
		return new Response("Bad Request", {
			status: 404,
		});
	}
}
