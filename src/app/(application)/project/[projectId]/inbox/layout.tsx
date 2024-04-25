import React from "react";

import { currentUser } from "@clerk/nextjs/server";
import { cookies } from "next/headers";

import ToggleSidebarButton from "~/app/components/layout/sidebar/toggle-sidebar-button";

import InboxButtons from "./components/InboxButtons";
import InboxPanel from "./components/InboxPanel";
import NotificationList from "./components/NotificationList";

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
						<div className="flex items-center gap-2">
							<ToggleSidebarButton />
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
			}
			defaultLayout={defaultLayout}
		>
			{children}
		</InboxPanel>
	);
}
