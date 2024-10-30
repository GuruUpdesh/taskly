import React from "react";

import { currentUser } from "@clerk/nextjs/server";

import { SidebarTrigger } from "~/components/ui/sidebar";
import InboxButtons from "~/features/notifications/components/InboxButtons";
import NotificationList from "~/features/notifications/components/NotificationList";

type Params = {
	children: React.ReactNode;
	params: {
		projectId: string;
	};
};

export default async function InboxLayout({
	children,
	params: { projectId },
}: Params) {
	const user = await currentUser();

	if (user === undefined || user === null) {
		return null;
	}

	return (
		<div className="grid h-svh grid-cols-4">
			<div className="col-span-1 flex flex-col border-r">
				<header className="flex items-center justify-between gap-2 border-b bg-background px-4 py-2">
					<div className="flex items-center gap-2">
						<SidebarTrigger />
						<h3 className="scroll-m-20 text-2xl font-bold tracking-tight">
							Inbox
						</h3>
					</div>
					<div className="flex gap-2">
						<InboxButtons user={user.id} />
					</div>
				</header>
				<section className="flex flex-col overflow-y-scroll">
					<div className="flex flex-grow flex-col overflow-y-auto">
						<NotificationList projectId={projectId} />
					</div>
				</section>
			</div>
			<div className="col-span-3">{children}</div>
		</div>
	);
}
