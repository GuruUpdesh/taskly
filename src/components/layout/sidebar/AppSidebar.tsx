import React from "react";

import { GearIcon, ReaderIcon, PlusCircledIcon } from "@radix-ui/react-icons";
import { LayoutDashboardIcon } from "lucide-react";
import dynamic from "next/dynamic";

import Logo from "~/components/Logo";
const UserButton = dynamic(
	() => import("~/components/user-button/UserButton"),
	{
		ssr: false,
		loading: () => <Skeleton className="h-[52px] rounded-xl" />,
	},
);
import SimpleTooltip from "~/components/SimpleTooltip";
import { Button } from "~/components/ui/button";
import {
	Sidebar as UiSidebar,
	SidebarContent,
	SidebarFooter,
	SidebarRail,
} from "~/components/ui/sidebar";
import { Skeleton } from "~/components/ui/skeleton";
import CreateTask from "~/features/tasks/components/CreateTask";
import { cn } from "~/lib/utils";

import InboxSidebarButton from "./InboxSidebarButton";
import ProjectListWrapper from "./project-list/ProjectListWrapper";
import SidebarButton from "./sidebar-button";
import SidebarSearch from "./sidebar-search";
import TaskViews from "./TaskViews";

interface SidebarProps {
	projectId: string;
}

const AppSidebar = ({ projectId }: SidebarProps) => {
	return (
		<UiSidebar className="z-40">
			<SidebarContent
				className={cn(
					"relative flex h-full flex-col justify-between bg-background px-4 @container",
				)}
			>
				<div>
					<div className="flex min-h-[57px] items-center">
						<Logo />
					</div>
					<div className="mb-4 mt-1 flex items-center gap-1">
						<SidebarSearch />
						<div className="hidden @sidebar:block">
							<CreateTask projectId={projectId}>
								<div>
									<SimpleTooltip label="Add Task">
										<Button
											className="aspect-square h-[36px] w-[36px] rounded-md bg-foreground/10 text-muted-foreground hover:text-foreground focus:text-foreground"
											variant="outline"
											size="iconSm"
										>
											<PlusCircledIcon />
											<span className="sr-only">
												Add Task
											</span>
										</Button>
									</SimpleTooltip>
								</div>
							</CreateTask>
						</div>
					</div>
					<SidebarButton
						label="Dashboard"
						icon={
							<LayoutDashboardIcon className="h-5 w-5 min-w-5" />
						}
						url={`/project/${projectId}`}
					/>
					<InboxSidebarButton projectId={projectId} />
					<TaskViews projectId={projectId} />
					<SidebarButton
						label="Docs"
						icon={<ReaderIcon className="h-5 w-5 min-w-5" />}
						url="https://docs.tasklypm.com"
						openInNewTab
					/>
					<SidebarButton
						label="Settings"
						icon={<GearIcon className="h-5 w-5 min-w-5" />}
						url={`/settings/project/${projectId}/general`}
					/>
				</div>
				<div className="min-h-20 shrink overflow-x-hidden overflow-y-scroll">
					<ProjectListWrapper />
				</div>
				<SidebarFooter className="p-0 pb-4">
					<UserButton size="large" />
				</SidebarFooter>
			</SidebarContent>
			<SidebarRail />
		</UiSidebar>
	);
};

export default AppSidebar;
