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
		<div className="grid h-svh grid-cols-4">
			<div className="col-span-1 flex flex-col border-r">
				<PageHeader>
					<h3 className="scroll-m-20 text-2xl font-medium tracking-tight">
						Inbox
					</h3>
				</PageHeader>
				<InboxButtons user={user.id} />
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
