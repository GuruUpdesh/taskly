"use client";

import React from "react";

import { PanelLeftClose, PanelLeftOpen } from "lucide-react";
import { useShallow } from "zustand/react/shallow";

import SimpleTooltip from "~/app/components/SimpleTooltip";
import { Button } from "~/components/ui/button";
import { cn } from "~/lib/utils";
import { useNavigationStore } from "~/store/navigation";

const ToggleSidebarButton = () => {
	const [isSideBarCollapsed, expandSideBar] = useNavigationStore(
		useShallow((state) => [state.isSideBarCollapsed, state.expandSideBar]),
	);
	return (
		<SimpleTooltip
			label={(isSideBarCollapsed ? "Open" : "Closed") + " Sidebar"}
		>
			<Button
				onClick={expandSideBar}
				variant="ghost"
				size="iconSm"
				className="relative"
			>
				{isSideBarCollapsed ? (
					<PanelLeftOpen className="h-4 w-4" />
				) : (
					<PanelLeftClose className="h-4 w-4" />
				)}
				<span
					className={cn(
						"absolute left-1 h-[12px] bg-foreground transition-all duration-300 ease-linear",
						{
							"w-[4px]": isSideBarCollapsed,
							"w-[0px]": !isSideBarCollapsed,
						},
					)}
				/>
			</Button>
		</SimpleTooltip>
	);
};

export default ToggleSidebarButton;
