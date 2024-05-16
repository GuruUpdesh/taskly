"use client";

import React, { useMemo } from "react";

import { Mail } from "lucide-react";

import SidebarButton from "~/app/components/layout/sidebar/sidebar-button";
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
				<div className="relative">
					<div className="absolute -right-2 -top-2 rounded-full bg-accent px-1 text-xs">
						{notificationCount == 0 ? null : notificationCount}
					</div>
					<Mail className="h-4 w-4 min-w-4" />
				</div>
			}
			url={`/project/${projectId}/inbox`}
		/>
	);
}
