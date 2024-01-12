import React from "react";
import {
	ResizableHandle,
	ResizablePanel,
	ResizablePanelGroup,
} from "~/components/ui/resizable";
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

export default function ApplicationLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<ResizablePanelGroup direction="horizontal">
			<ResizablePanel
				id="sidebar"
				minSize={7}
				collapsible={true}
				maxSize={25}
				defaultSize={15}
			>
				<div className="p-4 flex flex-col gap-4">
					<div className="flex min-w-0 justify-between">
						<h1>Project Name</h1>
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
			</ResizablePanel>

			<ResizableHandle className="" />
			<ResizablePanel defaultSize={75}>
				<main className="pt-4">{children}</main>
			</ResizablePanel>
		</ResizablePanelGroup>
	);
}
