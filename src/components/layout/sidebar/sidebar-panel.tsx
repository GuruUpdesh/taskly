"use client";

import React, { useEffect } from "react";
import {
	ResizableHandle,
	ResizablePanel,
	ResizablePanelGroup,
} from "~/components/ui/resizable";
import SettingsNavigationState from "./settings-navigation-state";
import { useNavigationStore } from "~/store/navigation";
import { type ImperativePanelHandle } from "react-resizable-panels";

type Props = {
	children: React.ReactNode;
	sidebarComponent: React.ReactNode;
	defaultLayout?: number[];
};

const SidebarPanel = ({
	children,
	sidebarComponent,
	defaultLayout = [15, 85],
}: Props) => {
	const [isSideBarCollapsed, setSideBarCollapsed, setExpandSideBar] =
		useNavigationStore((state) => [
			state.isSideBarCollapsed,
			state.setSideBarCollapsed,
			state.setExpandSideBar,
		]);
	const sidebarRef = React.useRef<ImperativePanelHandle>(null);

	function handleResize() {
		if (!sidebarRef.current) return;
		const collapsed = sidebarRef.current.isCollapsed();
		if (collapsed !== isSideBarCollapsed) {
			setSideBarCollapsed(collapsed);
		}
		setExpandSideBar(
			collapsed ? sidebarRef.current.expand : sidebarRef.current.collapse,
		);
	}

	useEffect(() => {
		handleResize();
	}, [sidebarRef]);

	const onLayout = (sizes: number[]) => {
		document.cookie = `react-resizable-panels:layout=${JSON.stringify(sizes)}`;
	};

	return (
		<ResizablePanelGroup
			direction="horizontal"
			onLayout={onLayout}
			id="group"
			autoSaveId="minMax"
		>
			<ResizablePanel
				ref={sidebarRef}
				id="sidebar"
				minSize={8}
				collapsible={true}
				collapsedSize={2}
				maxSize={20}
				defaultSize={defaultLayout?.[0]}
				order={0}
				onResize={handleResize}
				className="min-w-[50px] h-screen"
			>
				<SettingsNavigationState />
				{sidebarComponent}
			</ResizablePanel>
			<ResizableHandle className="" />
			<ResizablePanel defaultSize={defaultLayout?.[1]} order={1}>
				{children}
			</ResizablePanel>
		</ResizablePanelGroup>
	);
};

export default SidebarPanel;
