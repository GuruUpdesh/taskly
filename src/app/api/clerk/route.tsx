/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import type { UserWebhookEvent, WebhookEvent } from "@clerk/nextjs/server";
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
    const data = {
        userId: payload.data.id,
    }
	// Create a new user in database
	const newUserInfo: NewUserInfo = insertUserInfoSchema.parse(data);
	await db.insert(userInfo).values(newUserInfo);
}

async function onUserDeleted(payload: UserWebhookEvent) {
	// Delete the user from database
}

async function onUserUpdated(payload: UserWebhookEvent) {
	// Update the user in database
	// todo: do we need this?
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
			case "user.updated":
				await onUserUpdated(payload);
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
