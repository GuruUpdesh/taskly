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

const SettingsPanel = ({
	sidebarChildren,
	children,
	defaultLayout = [16, 84],
}: Props) => {
	const onLayout = (sizes: number[]) => {
		document.cookie = `react-resizable-panels:settings-layout=${JSON.stringify(sizes)}`;
	};
	return (
		<ResizablePanelGroup
			direction="horizontal"
			onLayout={onLayout}
			id="settings-group"
		>
			<ResizablePanel
				id="settings-sidebar"
				minSize={13}
				maxSize={25}
				defaultSize={defaultLayout?.[0]}
				order={0}
				className="min-w-100px relative !overflow-visible bg-accent/25"
			>
				{sidebarChildren}
			</ResizablePanel>
			<ResizableHandle />
			<ResizablePanel
				id="settings-content"
				defaultSize={defaultLayout?.[1]}
				order={1}
			>
				{children}
			</ResizablePanel>
		</ResizablePanelGroup>
	);
};

export default SettingsPanel;
