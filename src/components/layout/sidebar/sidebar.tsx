import React from "react";

import {
	GearIcon,
	DashboardIcon,
	LayoutIcon,
	TableIcon,
	ReaderIcon,
	PlusCircledIcon,
} from "@radix-ui/react-icons";
import Image from "next/image";
import Link from "next/link";

import CreateTask from "~/components/backlog/create-task";
import Logo from "~/components/general/logo";
import InboxSidebarButton from "~/components/inbox/InboxSidebarButton";
import { Button } from "~/components/ui/button";
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
		<div className="relative h-full bg-background @container">
			<SidebarBackgroundWrapper projectId={projectId} />
			<div className="flex h-full flex-col px-1.5 pb-2 @sidebar:px-4">
				<div className="flex min-h-[57px] items-center justify-center @sidebar:justify-start">
					<div className="hidden @sidebar:block">
						<Logo />
					</div>
					<Link href="/">
						<Image
							src="/favicon.ico"
							alt="logo"
							height="30"
							width="30"
							className="block @sidebar:hidden"
						/>
					</Link>
				</div>
				<div className="mb-2">
					<SelectProject projectId={projectId} />
				</div>
				<div className="mb-2 flex items-center gap-2">
					<SidebarSearch />
					<div className="hidden @sidebar:block">
						<CreateTask projectId={projectId}>
							<Button
								className="aspect-square h-[36px] w-[36px] bg-foreground/5 font-bold"
								variant="outline"
								size="iconSm"
							>
								<PlusCircledIcon />
							</Button>
						</CreateTask>
					</div>
				</div>
				<div>
					<SidebarButton
						label="Dashboard"
						icon={<DashboardIcon className="min-w-4" />}
						url={`/project/${projectId}`}
					/>
					<InboxSidebarButton projectId={projectId} />
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
				<div className="flex-1" />
				<div className="mb-2">
					<SidebarButton
						label="Docs"
						icon={
							<ReaderIcon className="min-w-4 fill-foreground" />
						}
						url="https://docs.tasklypm.com"
						openInNewTab
					/>
					<SidebarButton
						label="Settings"
						icon={<GearIcon className="min-w-4" />}
						url={`/settings/project/${projectId}/general`}
					/>
				</div>
				<div className="hidden @sidebar:block">
					<UserButton size="large" />
				</div>
				<div className="block @sidebar:hidden">
					<UserButton />
				</div>
			</div>
		</div>
	);
};

export default Sidebar;
