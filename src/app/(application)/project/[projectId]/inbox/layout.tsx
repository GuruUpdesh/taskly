import React from "react";

import { currentUser } from "@clerk/nextjs";

import { getAllNotifications } from "~/actions/notification-actions";
import InboxButtons from "~/components/inbox/InboxButtons";
import {
	ResizableHandle,
	ResizablePanel,
	ResizablePanelGroup,
} from "~/components/ui/resizable";

import NotificationItem from "./notification-item";

type Params = {
	children: React.ReactNode;
	params: {
		projectId: string;
	};
};

export default async function InboxLayout({ children }: Params) {
	const user = await currentUser();

	if (user === undefined || user === null) {
		return null;
	}

	const notifications = await getAllNotifications(user.id);

	if (notifications === undefined) {
		return null;
	}

	return (
		<ResizablePanelGroup direction="horizontal">
			<ResizablePanel
				id="inbox-sidebar"
				minSize={12}
				maxSize={25}
				defaultSize={20}
			>
				<div className="min-h-screen">
					<header className="flex items-center justify-between gap-2 border-b px-4 py-2">
						<h3 className="scroll-m-20 text-2xl font-bold tracking-tight">
							Inbox
						</h3>
						<div className="flex gap-2 pb-1">
							<InboxButtons user={user.id} />
						</div>
					</header>
					<section className="flex flex-col">
						{notifications.map((notification, i) => (
							<NotificationItem
								key={i}
								notification={notification}
							/>
						))}
					</section>
				</div>
			</ResizablePanel>
			<ResizableHandle className="" />
			<ResizablePanel defaultSize={75}>{children}</ResizablePanel>
		</ResizablePanelGroup>
	);
}
