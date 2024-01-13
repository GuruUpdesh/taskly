import React from "react";
import Sidebar from "~/components/layout/sidebar/sidebar";
import {
	ResizableHandle,
	ResizablePanel,
	ResizablePanelGroup,
} from "~/components/ui/resizable";

type Params = {
	children: React.ReactNode;
	params: {
		projectId: string;
	};
};

export default function ApplicationLayout({
	children,
	params: { projectId },
}: Params) {
	return (
		<ResizablePanelGroup direction="horizontal">
			<ResizablePanel
				id="sidebar"
				minSize={7}
				collapsible={true}
				maxSize={25}
				defaultSize={15}
			>
				<Sidebar projectId={projectId} />
			</ResizablePanel>
			<ResizableHandle className="" />
			<ResizablePanel defaultSize={75}>
				<main className="pt-4">{children}</main>
			</ResizablePanel>
		</ResizablePanelGroup>
	);
}
