"use client";

import React from "react";

import { PanelLeftClose, PanelLeftOpen } from "lucide-react";
import { useShallow } from "zustand/react/shallow";

import SimpleTooltip from "~/components/general/simple-tooltip";
import { Button } from "~/components/ui/button";
import { useNavigationStore } from "~/store/navigation";

const ToggleSidebarButton = () => {
	const [isSideBarCollapsed, expandSideBar] = useNavigationStore(
		useShallow((state) => [state.isSideBarCollapsed, state.expandSideBar]),
	);
	return (
		<SimpleTooltip
			label={(isSideBarCollapsed ? "Open" : "Closed") + " Sidebar"}
		>
			<Button onClick={expandSideBar} variant="outline" size="icon">
				{isSideBarCollapsed ? (
					<PanelLeftOpen className="h-4 w-4" />
				) : (
					<PanelLeftClose className="h-4 w-4" />
				)}
			</Button>
		</SimpleTooltip>
	);
};

export default ToggleSidebarButton;
