"use client";

import React, { useEffect } from "react";
import {
	deleteAllNotifications,
	readAllNotifications,
} from "~/actions/notification-actions";
import { Button } from "~/components/ui/button";
import { useNavigationStore } from "~/store/navigation";

type Props = {
	user: string;
	notificationCount: number;
};

export default function InboxButtons({ user, notificationCount }: Props) {
	const updateNotificationCount = useNavigationStore(
		(state) => state.updateNotificationCount,
	);

	useEffect(() => {
		updateNotificationCount(notificationCount);
	}, [notificationCount]);

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
