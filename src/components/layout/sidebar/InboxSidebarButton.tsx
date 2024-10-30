"use client";

import React, { useMemo } from "react";

import { Bell } from "lucide-react";

import SidebarButton from "~/components/layout/sidebar/sidebar-button";
import { useRealtimeStore } from "~/store/realtime";

type Props = {
	projectId: string;
};

export default function InboxSidebarButton({ projectId }: Props) {
	const notifications = useRealtimeStore((state) => state.notifications);
	const notificationCount = useMemo(() => {
		return notifications.filter((n) => n.readAt === null).length;
	}, [notifications]);

	return (
		<SidebarButton
			label="Inbox"
			icon={
				<div>
					<div className="absolute right-3 top-[50%] flex aspect-square h-[50%] translate-y-[-50%] items-center justify-center rounded-full text-xs">
						{notificationCount == 0 ? null : notificationCount}
					</div>
					<Bell className="h-5 w-5 min-w-5" />
				</div>
			}
			url={`/project/${projectId}/inbox`}
		/>
	);
}
