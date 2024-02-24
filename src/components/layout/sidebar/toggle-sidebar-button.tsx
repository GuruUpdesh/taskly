"use client";

import { PanelLeftClose, PanelLeftOpen } from "lucide-react";
import React from "react";
import { Button } from "~/components/ui/button";
import { useNavigationStore } from "~/store/navigation";
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "~/components/ui/tooltip";

const ToggleSidebarButton = () => {
	const [isSideBarCollapsed, expandSideBar] = useNavigationStore((state) => [
		state.isSideBarCollapsed,
		state.expandSideBar,
	]);
	return (
		<TooltipProvider delayDuration={150}>
			<Tooltip>
				<TooltipTrigger asChild>
					<Button
						onClick={expandSideBar}
						variant="outline"
						size="icon"
					>
						{isSideBarCollapsed ? (
							<PanelLeftOpen className="h-4 w-4" />
						) : (
							<PanelLeftClose className="h-4 w-4" />
						)}
					</Button>
				</TooltipTrigger>
				<TooltipContent>
					{isSideBarCollapsed ? "Open" : "Closed"} Sidebar
				</TooltipContent>
			</Tooltip>
		</TooltipProvider>
	);
};

export default ToggleSidebarButton;
