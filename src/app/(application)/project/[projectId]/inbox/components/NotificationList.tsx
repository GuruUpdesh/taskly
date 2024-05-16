"use client";

import React from "react";

import { format, isToday, isYesterday, subDays } from "date-fns";
import { AnimatePresence } from "framer-motion";

import { type NotificationWithTask } from "~/actions/notification-actions";
import { cn } from "~/lib/utils";
import { useRealtimeStore } from "~/store/realtime";
import typography from "~/styles/typography";

import NotificationItem from "./NotificationItem";

type Group = Record<string, NotificationWithTask[]>;

interface Groups {
	today: NotificationWithTask[];
	yesterday: NotificationWithTask[];
	last7Days: NotificationWithTask[];
	last30Days: NotificationWithTask[];
	earlier: Group;
}

const groupNotifications = (notifications: NotificationWithTask[]): Groups => {
	const groups: Groups = {
		today: [],
		yesterday: [],
		last7Days: [],
		last30Days: [],
		earlier: {},
	};

	notifications.forEach((notification) => {
		const date = new Date(notification.date);
		if (isToday(date)) {
			groups.today.push(notification);
		} else if (isYesterday(date)) {
			groups.yesterday.push(notification);
		} else if (date > subDays(new Date(), 7)) {
			groups.last7Days.push(notification);
		} else if (date > subDays(new Date(), 30)) {
			groups.last30Days.push(notification);
		} else {
			const monthYear = format(date, "MMMM yyyy");
			groups.earlier[monthYear] = groups.earlier[monthYear] ?? [];
			groups.earlier[monthYear]?.push(notification);
		}
	});

	return groups;
};

type Props = {
	projectId: string;
};

const NotificationList = ({ projectId }: Props) => {
	const notifications = useRealtimeStore((state) => state.notifications);
	const groupedNotifications = groupNotifications(notifications);

	return (
		<AnimatePresence initial={false}>
			{(["today", "yesterday", "last7Days", "last30Days"] as const).map(
				(group) => {
					const notificationGroup = groupedNotifications[group];
					return (
						notificationGroup.length > 0 && (
							<div className="mb-4" key={group}>
								<h2
									className={cn(
										"border-b pb-1 pl-2 capitalize",
										typography.paragraph.p_muted,
									)}
								>
									{group}
								</h2>
								{notificationGroup.map((notification, i) => (
									<NotificationItem
										key={i}
										notification={notification}
										projectId={projectId}
									/>
								))}
							</div>
						)
					);
				},
			)}
			{Object.entries(groupedNotifications.earlier).map(
				([monthYear, notifications]) => (
					<div className="mb-4" key={monthYear}>
						<h2
							className={cn(
								"pl-2 capitalize",
								typography.paragraph.p_muted,
							)}
						>
							{monthYear}
						</h2>
						{notifications.map((notification, i) => (
							<NotificationItem
								key={i}
								notification={notification}
								projectId={projectId}
							/>
						))}
					</div>
				),
			)}
		</AnimatePresence>
	);
};

export default NotificationList;
