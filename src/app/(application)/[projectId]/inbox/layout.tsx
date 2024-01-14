import React from "react";
import { Button } from "~/components/ui/button";
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

export default function InboxLayout({ children }: Params) {
	return (
		<ResizablePanelGroup direction="horizontal">
			<ResizablePanel
				id="inbox-sidebar"
				minSize={12}
				maxSize={25}
				defaultSize={15}
			>
				<div className="min-h-screen px-4">
					<header className="flex items-center justify-between gap-2 border-b pb-4 pt-4">
						<h3 className="scroll-m-20 text-2xl font-bold tracking-tight">
							Inbox
						</h3>
						<div className="flex gap-2">
							<Button variant="outline" size="sm">
								Filter
							</Button>
							<Button variant="outline" size="sm">
								Clear All
							</Button>
						</div>
					</header>
					<section className="flex flex-col gap-2 py-2">
						<NotificationItem />
					</section>
				</div>
			</ResizablePanel>
			<ResizableHandle className="" />
			<ResizablePanel defaultSize={75}>{children}</ResizablePanel>
		</ResizablePanelGroup>
	);
}
