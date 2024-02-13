"use client";

import React from "react";
import { Label } from "~/components/ui/label";
import {
	NavigationMenuContent,
	NavigationMenuItem,
	NavigationMenuLink,
	NavigationMenuList,
	NavigationMenuTrigger,
} from "~/components/ui/navigation-menu";
import Link from "next/link";
import RecentTasks from "~/components/page/project/recent-tasks";

type Props = {
	children: React.ReactNode;
};

const AppNavMenu = ({ children }: Props) => {
	return (
		<NavigationMenuItem>
			<Link href="/app">
				<NavigationMenuTrigger className="text-base">
					App
				</NavigationMenuTrigger>
			</Link>
			<NavigationMenuContent className="flex gap-4 p-2">
				<NavigationMenuLink
					href="/app"
					className="flex min-h-[200px] flex-col rounded-lg bg-accent-foreground/5 p-4 px-8 hover:bg-accent-foreground/10"
				>
					<div className="flex gap-4">
						<div className="aspect-square h-[10px] rounded-full border-indigo-600 bg-indigo-800" />
						<div className="aspect-square h-[10px] rounded-full border-red-600 bg-red-800" />
						<div className="aspect-square h-[10px] rounded-full border-yellow-500 bg-yellow-600" />
						<div className="aspect-square h-[10px] rounded-full border-green-400 bg-green-600" />
					</div>
					<div className="flex-grow" />
					<h2 className="text-lg font-medium">Taskly Application</h2>
					<p className="text-sm text-muted-foreground">
						Manage your projects and tasks
					</p>
				</NavigationMenuLink>
				<div className="min-w-[300px]">
					<Label className="whitespace-nowrap font-bold">
						Current Project
					</Label>
					<NavigationMenuList></NavigationMenuList>
					<Label className="whitespace-nowrap font-bold">
						Recent Tasks
					</Label>
					{children}
				</div>
			</NavigationMenuContent>
		</NavigationMenuItem>
	);
};

export default AppNavMenu;
