import React from "react";

import { currentUser } from "@clerk/nextjs";
import { cookies } from "next/headers";

import InboxButtons from "~/components/inbox/InboxButtons";

import InboxPanel from "./inbox-panel";
import NotificationList from "./notification-list";

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

	const layout = cookies().get("react-resizable-panels:inbox-layout");
	let defaultLayout;
	if (layout) {
		defaultLayout = JSON.parse(layout.value) as number[] | undefined;
	}

	return (
		<InboxPanel
			sidebarChildren={
				<div className="flex max-h-screen min-h-screen flex-col">
					<header className="flex items-center justify-between gap-2 border-b px-4 py-2">
						<h3 className="scroll-m-20 text-2xl font-bold tracking-tight">
							Inbox
						</h3>
						<div className="flex gap-2 pb-1">
							<InboxButtons user={user.id} />
						</div>
					</header>
					<section className="flex flex-col overflow-y-scroll">
						<div className="flex flex-grow flex-col overflow-y-auto">
							<NotificationList />
						</div>
					</section>
				</div>
			}
			defaultLayout={defaultLayout}
		>
			{children}
		</InboxPanel>
	);
}
