"use client";

import React from "react";

import {
	ResizableHandle,
	ResizablePanel,
	ResizablePanelGroup,
} from "~/components/ui/resizable";

type Props = {
	sidebarChildren: React.ReactNode;
	children: React.ReactNode;
	defaultLayout?: number[];
};

const InboxPanel = ({
	sidebarChildren,
	children,
	defaultLayout = [20, 80],
}: Props) => {
	const onLayout = (sizes: number[]) => {
		const cookieValue = `react-resizable-panels:inbox-layout=${JSON.stringify(sizes)}`;
		document.cookie = `${cookieValue}; SameSite=Lax`;
	};
	return (
		<ResizablePanelGroup
			direction="horizontal"
			onLayout={onLayout}
			id="inbox-group"
		>
			<ResizablePanel
				id="inbox-sidebar"
				minSize={12}
				maxSize={25}
				defaultSize={defaultLayout?.[0]}
				order={0}
			>
				{sidebarChildren}
			</ResizablePanel>
			<ResizableHandle className="" />
			<ResizablePanel
				id="inbox-task"
				defaultSize={defaultLayout?.[1]}
				order={1}
			>
				{children}
			</ResizablePanel>
		</ResizablePanelGroup>
	);
};

export default InboxPanel;
