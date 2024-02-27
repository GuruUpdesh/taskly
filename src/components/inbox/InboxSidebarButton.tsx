"use client";

import React from "react";
import SidebarButton from "../layout/sidebar/sidebar-button";
import { EnvelopeClosedIcon } from "@radix-ui/react-icons";
import { useNavigationStore } from "~/store/navigation";

type Props = {
	projectId: string;
};

export default function InboxSidebarButton({ projectId }: Props) {
	const notificationCount = useNavigationStore(
		(state) => state.notificationCount,
	);

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
