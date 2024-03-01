"use client";

import React from "react";

import {
	deleteAllNotifications,
	readAllNotifications,
} from "~/actions/notification-actions";
import { Button } from "~/components/ui/button";

type Props = {
	user: string;
};

export default function InboxButtons({ user }: Props) {
	async function markAllAsRead(userId: string) {
		await readAllNotifications(userId);
	}

	async function deleteNotificationsForUser(userId: string) {
		await deleteAllNotifications(userId);
	}

	return (
		<>
			<Button
				variant="outline"
				onClick={() => markAllAsRead(user)}
				size="sm"
			>
				Mark As Read
			</Button>
			<Button
				variant="outline"
				onClick={() => deleteNotificationsForUser(user)}
				size="sm"
			>
				Clear All
			</Button>
		</>
	);
}
