"use client";

import React, { useEffect } from "react";

import { type ImperativePanelHandle } from "react-resizable-panels";
import { useShallow } from "zustand/react/shallow";

import {
	ResizableHandle,
	ResizablePanel,
	ResizablePanelGroup,
} from "~/components/ui/resizable";
import { useNavigationStore } from "~/store/navigation";

import SettingsNavigationState from "./settings-navigation-state";

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
		useNavigationStore(
			useShallow((state) => [
				state.isSideBarCollapsed,
				state.setSideBarCollapsed,
				state.setExpandSideBar,
			]),
		);
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
		const cookieValue = `react-resizable-panels:layout=${JSON.stringify(sizes)}`;
		document.cookie = `${cookieValue}; SameSite=Lax`;
	};

	return (
		<ResizablePanelGroup
			direction="horizontal"
			onLayout={onLayout}
			id="group"
		>
			<ResizablePanel
				ref={sidebarRef}
				id="sidebar"
				minSize={10}
				collapsible={true}
				collapsedSize={2}
				maxSize={20}
				defaultSize={defaultLayout?.[0]}
				order={0}
				onResize={handleResize}
				className="h-screen min-w-[50px]"
			>
				<SettingsNavigationState />
				{sidebarComponent}
			</ResizablePanel>
			<ResizableHandle />
			<ResizablePanel defaultSize={defaultLayout?.[1]} order={1}>
				{children}
			</ResizablePanel>
		</ResizablePanelGroup>
	);
};

export default SidebarPanel;
