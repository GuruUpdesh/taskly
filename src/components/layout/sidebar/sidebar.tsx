import React from "react";

import {
	HomeIcon,
	EnvelopeClosedIcon,
	GearIcon,
	ReaderIcon,
	DashboardIcon,
	LayoutIcon,
	TableIcon,
	MagnifyingGlassIcon,
} from "@radix-ui/react-icons";

import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Separator } from "~/components/ui/separator";
import UserButtonWrapper from "~/components/user-button/user-button-wrapper";

import SelectProject from "./select project/select-project";
import SidebarBackgroundWrapper from "./sidebar-background";
import SidebarButton from "./sidebar-button";

interface SidebarProps {
	projectId: string;
}

const Sidebar = ({ projectId }: SidebarProps) => {
	return (
		<div className="relative h-full @container">
			<SidebarBackgroundWrapper projectId={projectId} />
			<div className="flex min-w-0 items-center justify-center gap-1 border-b py-2 @sidebar:justify-between @sidebar:gap-8 @sidebar:px-4 ">
				<SidebarButton
					label="Home"
					icon={<HomeIcon />}
					url="/"
					hidden
				/>
				<Separator
					orientation="vertical"
					className="hidden h-[40px] @sidebar:block"
				/>
				<UserButtonWrapper />
			</div>
			<div className="flex h-full flex-col gap-4 px-1 py-4 @sidebar:p-4">
				<SelectProject projectId={projectId} />
				<div className="relative hidden @sidebar:block">
					<MagnifyingGlassIcon className="absolute left-2 top-[50%] h-4 w-4 translate-y-[-50%] text-muted-foreground" />
					<Input
						placeholder="Search"
						className="h-9 bg-background/75 pl-8"
					/>
				</div>
				<Button
					variant="outline"
					size="icon"
					className="z-10 h-9 bg-background/75 text-muted-foreground @sidebar:hidden"
				>
					<MagnifyingGlassIcon />
				</Button>
				<Separator />
				<div className="border-b pb-4">
					<SidebarButton
						label="Dashboard"
						icon={<DashboardIcon className="min-w-4" />}
						url={`/project/${projectId}`}
					/>
					<SidebarButton
						label="Inbox"
						icon={
							<div className="relative">
								<div className="absolute -right-2 -top-2 rounded-full bg-accent px-1 text-xs">
									1
								</div>
								<EnvelopeClosedIcon className="min-w-4" />
							</div>
						}
						url={`/project/${projectId}/inbox`}
					/>
					<SidebarButton
						label="Docs"
						icon={<ReaderIcon className="min-w-4" />}
						url="https://docs.tasklypm.com"
						openInNewTab
					/>
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
		</div>
	);
};

export default Sidebar;
