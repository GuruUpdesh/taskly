"use client";

import React, { useMemo } from "react";

import { EnvelopeClosedIcon } from "@radix-ui/react-icons";

import SidebarButton from "~/components/layout/sidebar/sidebar-button";
import { useAppStore } from "~/store/app";

type Props = {
	projectId: string;
};

export default function InboxSidebarButton({ projectId }: Props) {
	const notifications = useAppStore((state) => state.notifications);
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
					<EnvelopeClosedIcon className="min-w-4" />
				</div>
			}
			url={`/project/${projectId}/inbox`}
		/>
	);
}
