"use client";

import React from "react";

import { useAuth } from "@clerk/nextjs";
import Link from "next/link";

import {
	NavigationMenuContent,
	NavigationMenuItem,
	NavigationMenuLink,
	NavigationMenuTrigger,
} from "~/components/ui/navigation-menu";
type Props = {
	children: React.ReactNode;
};

const AppNavMenu = ({ children }: Props) => {
	const { isLoaded, userId } = useAuth();

	if (!isLoaded || !userId) {
		return (
			<NavigationMenuItem>
				<NavigationMenuLink
					className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
					href="/app"
				>
					Application
				</NavigationMenuLink>
			</NavigationMenuItem>
		);
	}
	return (
		<NavigationMenuItem>
			<Link href="/app">
				<NavigationMenuTrigger className="text-base">
					Application
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
				<div className="min-w-[350px] pr-2">{children}</div>
			</NavigationMenuContent>
		</NavigationMenuItem>
	);
};

export default AppNavMenu;
