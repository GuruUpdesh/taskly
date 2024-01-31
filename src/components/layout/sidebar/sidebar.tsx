import React from "react";
import {
	HomeIcon,
	EnvelopeClosedIcon,
	GearIcon,
	ReaderIcon,
	DashboardIcon,
	LayoutIcon,
	TableIcon,
} from "@radix-ui/react-icons";
import { Input } from "~/components/ui/input";
import SelectProject from "./select project/select-project";
import SidebarButton from "./sidebar-button";
import { UserButton } from "@clerk/nextjs";
import { Separator } from "~/components/ui/separator";

interface SidebarProps {
	projectId: string;
}

const Sidebar = ({ projectId }: SidebarProps) => {
	return (
		<div>
			<div className="flex min-w-0 items-center justify-between gap-8 border-b px-4 py-2">
				<SidebarButton label="Home" icon={<HomeIcon />} url="/" />
				<Separator orientation="vertical" className="h-[40px]" />
				<UserButton />
			</div>
			<div className="flex h-screen flex-col gap-4 p-4">
				<SelectProject projectId={projectId} />
				<div className="border-b pb-4">
					<Input placeholder="Search" className="h-8 min-w-0" />
				</div>
				<div className="border-b pb-4">
					<SidebarButton
						label="Inbox"
						icon={<EnvelopeClosedIcon />}
						url={`/project/${projectId}/inbox`}
					>
						<div className=" flex-1" />
						<div className="rounded-full bg-accent px-4">1</div>
					</SidebarButton>
					<SidebarButton
						label="Dashboard"
						icon={<DashboardIcon />}
						url={`/project/${projectId}/dashboard`}
					/>
					<SidebarButton
						label="Docs"
						icon={<ReaderIcon />}
						url="https://docs.tasklypm.com"
						openInNewTab
					/>
				</div>
				<div className="border-b pb-4">
					<SidebarButton
						label="Backlog"
						icon={<TableIcon />}
						url={`/project/${projectId}/backlog`}
					/>
					<SidebarButton
						label="Board"
						icon={<LayoutIcon />}
						url={`/project/${projectId}/board`}
					/>
				</div>
				<div>
					<SidebarButton
						label="Settings"
						icon={<GearIcon />}
						url="/settings"
					/>
				</div>
			</div>
		</div>
	);
};

export default Sidebar;
