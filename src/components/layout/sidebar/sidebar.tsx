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
import { UserButton } from "@clerk/nextjs";
import { Input } from "~/components/ui/input";
import Link from "next/link";
import SelectProject from "./select project/select-project";

interface SidebarProps {
	projectId: string;
}

const Sidebar = ({ projectId }: SidebarProps) => {
	return (
		<div className="flex h-screen flex-col gap-4 p-4">
			<div className="flex min-w-0 items-center justify-between gap-8">
				<SelectProject projectId={projectId} />
				<UserButton />
			</div>
			<Input placeholder="Search" className="h-8 min-w-0" />
			<div className="border-b pb-4">
				<Link href="/">
					<Button
						variant="ghost"
						size="sm"
						className="w-full justify-start gap-2 px-4 font-semibold"
					>
						<HomeIcon />
						Home
					</Button>
				</Link>
				<Link href="/email">
					<Button
						variant="ghost"
						size="sm"
						className="w-full justify-start gap-2 px-4 font-semibold"
					>
						<EnvelopeClosedIcon />
						Inbox
						<div className=" flex-1" />
						<div className="rounded-full bg-accent px-4">1</div>
					</Button>
				</Link>
				<Link href="/">
					<Button
						variant="ghost"
						size="sm"
						className="w-full justify-start gap-2 px-4 font-semibold"
					>
						<DashboardIcon />
						Dashboard
					</Button>
				</Link>
				<Link href="/">
					<Button
						variant="ghost"
						size="sm"
						className="w-full justify-start gap-2 px-4 font-semibold"
					>
						<ReaderIcon />
						Docs
					</Button>
				</Link>
			</div>
			<div>
				<Button
					variant="ghost"
					size="sm"
					className="w-full justify-start gap-2 px-4 font-semibold"
				>
					<TableIcon />
					Backlog
				</Button>
				<Button
					variant="ghost"
					size="sm"
					className="w-full justify-start gap-2 px-4 font-semibold"
				>
					<LayoutIcon />
					Board
				</Button>
			</div>
			<Button
				variant="ghost"
				size="sm"
				className="w-full justify-start gap-2 px-4 font-semibold"
			>
				<GearIcon />
				Settings
			</Button>
		</div>
	);
};

export default Sidebar;
