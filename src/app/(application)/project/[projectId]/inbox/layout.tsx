import React from "react";

import { currentUser } from "@clerk/nextjs/server";

import PageHeader from "~/components/layout/PageHeader";
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
		<div className="relative grid h-[calc(100svh-1rem-1px)] grid-cols-4">
			<div className="col-span-1 flex h-full flex-col overflow-hidden border-r">
				<PageHeader className="h-[57px]" toggle={false}>
					<h3 className="text-2xl font-medium tracking-tight">
						Inbox
					</h3>
					<div className="flex-1" />
					<InboxButtons user={user.id} />
				</PageHeader>
				<section className="max-w-full flex-1 overflow-y-auto overflow-x-hidden">
					<NotificationList projectId={projectId} />
				</section>
			</div>
			<div className="col-span-3">{children}</div>
		</div>
	);
}
