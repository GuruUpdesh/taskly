import React from "react";

import { currentUser } from "@clerk/nextjs/server";
import { GearIcon, ReaderIcon, PlusCircledIcon } from "@radix-ui/react-icons";
import { LayoutGrid } from "lucide-react";
import dynamic from "next/dynamic";
import Image from "next/image";
import Link from "next/link";

import CreateTask from "~/app/components/CreateTask";
import Logo from "~/app/components/Logo";
const UserButton = dynamic(
	() => import("~/app/components/user-button/UserButton"),
	{
		ssr: false,
		loading: () => <Skeleton className="h-[46px] rounded-md" />,
	},
);
import { Button } from "~/components/ui/button";
import { Skeleton } from "~/components/ui/skeleton";

import InboxSidebarButton from "./InboxSidebarButton";
import SelectProject from "./select project/select-project";
import SidebarButton from "./sidebar-button";
import SidebarSearch from "./sidebar-search";
import TaskViews from "./TaskViews";

interface SidebarProps {
	projectId: string;
}

const Sidebar = async ({ projectId }: SidebarProps) => {
	const user = await currentUser();
	return (
		<div className="relative h-full bg-background @container">
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
						icon={<LayoutGrid className="h-4 w-4 min-w-4" />}
						url={`/project/${projectId}`}
					/>
					<InboxSidebarButton projectId={projectId} />
					<TaskViews
						projectId={projectId}
						username={user?.username}
					/>
				</div>
				<div className="flex-1" />
				<div className="mb-2">
					<SidebarButton
						label="Settings"
						icon={<GearIcon className="min-w-4" />}
						url={`/settings/project/${projectId}/general`}
					/>
					<SidebarButton
						label="Documentation"
						icon={
							<ReaderIcon className="min-w-4 fill-foreground" />
						}
						url="https://docs.tasklypm.com"
						openInNewTab
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
