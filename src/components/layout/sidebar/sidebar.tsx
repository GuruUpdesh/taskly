import React from "react";
import { Button } from "~/components/ui/button";
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
import { currentUser } from "@clerk/nextjs";
import Image from "next/image";
import SidebarButton from "./sidebar-button";

interface SidebarProps {
	projectId: string;
}

const Sidebar = async ({ projectId }: SidebarProps) => {
	const user = await currentUser();

	const renderUserButton = () => {
		if (!user || !user.hasImage || !user.imageUrl) return null;

		return (
			<Button variant="ghost" size="icon" className="aspect-square p-1">
				<Image
					src={user.imageUrl}
					alt="user-image"
					height={25}
					width={25}
					className="rounded-full border"
				/>
			</Button>
		);
	};

	return (
		<div className="flex h-screen flex-col gap-4 p-4">
			<div className="flex min-w-0 items-center justify-between gap-8">
				<SelectProject projectId={projectId} />
				{renderUserButton()}
			</div>
			<Input placeholder="Search" className="h-8 min-w-0" />
			<div className="border-b pb-4">
				<SidebarButton label="Home" icon={<HomeIcon />} url="/" />
				<SidebarButton
					label="Inbox"
					icon={<EnvelopeClosedIcon />}
					url={`/${projectId}/inbox`}
				>
					<div className=" flex-1" />
					<div className="rounded-full bg-accent px-4">1</div>
				</SidebarButton>
				<SidebarButton
					label="Dashboard"
					icon={<DashboardIcon />}
					url={`/${projectId}/dashboard`}
				/>
				<SidebarButton
					label="Docs"
					icon={<ReaderIcon />}
					url="https://docs.tasklypm.com"
					openInNewTab
				/>
			</div>
			<div>
				<SidebarButton
					label="Backlog"
					icon={<TableIcon />}
					url={`/${projectId}/backlog`}
				/>
				<SidebarButton
					label="Board"
					icon={<LayoutIcon />}
					url={`/${projectId}/board`}
				/>
			</div>
			<SidebarButton
				label="Settings"
				icon={<GearIcon />}
				url="/settings"
			/>
		</div>
	);
};

export default Sidebar;
