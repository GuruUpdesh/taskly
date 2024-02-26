import React from "react";
import {
	ResizableHandle,
	ResizablePanel,
	ResizablePanelGroup,
} from "~/components/ui/resizable";
import NotificationItem from "./notification-item";
import { getAllNotifications } from "~/actions/notification-actions";
import { currentUser } from "@clerk/nextjs";
import InboxButtons from "~/components/inbox/InboxButtons";

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
					<header className="flex items-center justify-between gap-2 border-b p-4">
						<h3 className="scroll-m-20 text-2xl font-bold tracking-tight">
							Inbox
						</h3>
						<div className="flex gap-2">
							<InboxButtons
								notificationCount={
									notifications.filter(
										(n) => n.readAt === null,
									).length
								}
								user={user.id}
							/>
						</div>
					</header>
					<section className="flex flex-col gap-2 py-2">
						{notifications.map((notification, i) => (
							<NotificationItem
								key={i}
								id={notification.id.toString()}
								message={notification.message}
								date={notification.date.toDateString()}
								task={notification.task}
								read={notification.readAt !== null}
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
