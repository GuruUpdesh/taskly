"use server";

import { eq } from "drizzle-orm";
import { db } from "~/server/db";
import {
	type Notification,
	notifications,
	NewNotification,
} from "~/server/db/schema";
import { throwServerError } from "~/utils/errors";

export async function getNotificationsForUser(userId: string) {
	try {
		const notifications: Notification[] =
			await db.query.notifications.findMany({
				where: (notification) => eq(notification.userId, userId),
			});

		return notifications;
	} catch (error) {
		if (error instanceof Error) throwServerError(error.message);
	}
}

export async function createNotification(notification: NewNotification) {
	try {
		const newNotification = await db
			.insert(notifications)
			.values(notification);

		return newNotification;
	} catch (error) {
		if (error instanceof Error) throwServerError(error.message);
	}
}

export async function deleteNotification(notificationId: string) {
	try {
		await db
			.delete(notifications)
			.where(eq(notifications.id, parseInt(notificationId)));
	} catch (error) {
		if (error instanceof Error) throwServerError(error.message);
	}
}

export async function updateNotification(notification: Notification) {
	try {
		await db
			.update(notifications)
			.set(notification)
			.where(eq(notifications.id, notification.id));
	} catch (error) {
		if (error instanceof Error) throwServerError(error.message);
	}
}
