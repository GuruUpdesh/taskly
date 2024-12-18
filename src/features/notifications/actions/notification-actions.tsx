"use server";

import { eq, desc } from "drizzle-orm";
import { revalidatePath } from "next/cache";

import { db } from "~/db";
import { logger } from "~/lib/logger";
import {
	notifications,
	insertNotificationSchema,
	type NewNotification,
	type Task,
	type Notification,
} from "~/schema";
import { type ActionReturnType } from "~/utils/actionReturnType";
import { throwServerError } from "~/utils/errors";

export async function createNotification(data: NewNotification) {
	try {
		const newNotification = insertNotificationSchema.parse(data);

		await db.insert(notifications).values(newNotification);

		return { success: true, message: "Notification created" };
	} catch (error) {
		logger.error(error);
		if (error instanceof Error) {
			throwServerError(error.message ?? "Error creating notification");
		}
		return { success: false, message: "Error creating notification" };
	}
}

export async function getNotification(notificationId: number) {
	try {
		const notification = await db.query.notifications.findMany({
			where: (notification) => eq(notification.id, notificationId),
			with: {
				task: {},
			},
		});
		return notification;
	} catch (error) {
		if (error instanceof Error) throwServerError(error.message);
	}
}

export type NotificationWithTask = Notification & {
	task: Task | null;
	options?: { isNew: boolean };
};

export async function getAllNotifications(
	userId: string,
): Promise<ActionReturnType<NotificationWithTask[]>> {
	try {
		const allNotifications = await db.query.notifications.findMany({
			where: (notification) => eq(notification.userId, userId),
			orderBy: desc(notifications.date),
			with: {
				task: true,
			},
		});
		return { data: allNotifications, error: null };
	} catch (error) {
		logger.error(error);
		if (error instanceof Error) {
			return { data: null, error: error.message };
		}
		return { data: null, error: "An unknown error occurred" };
	}
}

export async function readNotification(notificationId: number) {
	try {
		await db
			.update(notifications)
			.set({
				readAt: new Date(),
			})
			.where(eq(notifications.id, notificationId));
		revalidatePath("/");
	} catch (error) {
		logger.error(error);
		if (error instanceof Error) throwServerError(error.message);
	}
}

export async function unreadNotification(notificationId: number) {
	try {
		await db
			.update(notifications)
			.set({
				readAt: null,
			})
			.where(eq(notifications.id, notificationId));
		revalidatePath("/");
	} catch (error) {
		logger.error(error);
		if (error instanceof Error) throwServerError(error.message);
	}
}

export async function deleteNotification(notificationId: number) {
	try {
		await db
			.delete(notifications)
			.where(eq(notifications.id, notificationId));
		revalidatePath("/");
	} catch (error) {
		logger.error(error);
		if (error instanceof Error) throwServerError(error.message);
	}
}

export async function deleteAllNotifications(userId: string) {
	try {
		await db.delete(notifications).where(eq(notifications.userId, userId));
		revalidatePath("/");
	} catch (error) {
		logger.error(error);
		if (error instanceof Error) throwServerError(error.message);
	}
}

export async function readAllNotifications(userId: string) {
	try {
		await db
			.update(notifications)
			.set({
				readAt: new Date(),
			})
			.where(eq(notifications.userId, userId));
		revalidatePath("/");
	} catch (error) {
		logger.error(error);
		if (error instanceof Error) throwServerError(error.message);
	}
}
