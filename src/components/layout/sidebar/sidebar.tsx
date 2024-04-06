import React from "react";

import {
	HomeIcon,
	GearIcon,
	DashboardIcon,
	LayoutIcon,
	TableIcon,
} from "@radix-ui/react-icons";
import { Plus } from "lucide-react";

import CreateTask from "~/components/backlog/create-task";
import SimpleTooltip from "~/components/general/simple-tooltip";
import InboxSidebarButton from "~/components/inbox/InboxSidebarButton";
import { Button } from "~/components/ui/button";
import { Separator } from "~/components/ui/separator";
import UserButton from "~/components/user-button/user-button";

import SelectProject from "./select project/select-project";
import SidebarBackgroundWrapper from "./sidebar-background";
import SidebarButton from "./sidebar-button";
import SidebarSearch from "./sidebar-search";

interface SidebarProps {
	projectId: string;
}

const Sidebar = ({ projectId }: SidebarProps) => {
	return (
		<div className="relative h-full @container">
			<SidebarBackgroundWrapper projectId={projectId} />
			<div className="flex min-w-0 items-center justify-center border-b py-2 @sidebar:justify-between @sidebar:px-4 ">
				<SidebarButton
					label="Home"
					icon={<HomeIcon />}
					url="/"
					hidden
				/>
				<UserButton />
			</div>
			<div className="flex h-full flex-col gap-4 px-1 py-4 @sidebar:p-4">
				<SelectProject projectId={projectId} />
				<SidebarSearch />
				<Separator />
				<div className="border-b pb-4">
					<SidebarButton
						label="Dashboard"
						icon={<DashboardIcon className="min-w-4" />}
						url={`/project/${projectId}`}
					/>
					<InboxSidebarButton projectId={projectId} />
					{/* <SidebarButton
						label="Docs"
						icon={<ReaderIcon className="min-w-4" />}
						url="https://docs.tasklypm.com"
						openInNewTab
					/> */}
				</div>
				<div className="border-b pb-4">
					<SidebarButton
						label="Backlog"
						icon={<TableIcon className="min-w-4" />}
						url={`/project/${projectId}/backlog`}
					/>
					<SidebarButton
						label="Board"
						icon={<LayoutIcon className="min-w-4" />}
						url={`/project/${projectId}/board`}
					/>
				</div>
				<div>
					<SidebarButton
						label="Settings"
						icon={<GearIcon className="min-w-4" />}
						url={`/settings/project/${projectId}/general`}
					/>
				</div>
			</div>
			<CreateTask projectId={projectId}>
				<div className="absolute bottom-0 w-full flex-grow p-2">
					<SimpleTooltip label="Create a Task" side="right">
						<Button
							className=" flex w-full justify-center gap-1 border-white/25 bg-background/50 font-bold @sidebar:justify-between"
							variant="outline"
							size="sm"
						>
							<span className="hidden @sidebar:block">
								New Task
							</span>
							<Plus className="m-h-4 h-4 w-4 min-w-4" />
						</Button>
					</SimpleTooltip>
				</div>
			</CreateTask>
		</div>
	);
};

export default Sidebar;
