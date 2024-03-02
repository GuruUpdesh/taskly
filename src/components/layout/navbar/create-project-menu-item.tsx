"use client";

import React from "react";

import { Plus } from "lucide-react";

import {
	NavigationMenuItem,
	NavigationMenuLink,
} from "~/components/ui/navigation-menu";

const CreateProjectMenuItem = () => {
	return (
		<NavigationMenuItem>
			<NavigationMenuLink
				className="flex select-none items-center gap-1 space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
				href="/create-project"
			>
				Create Project
				<Plus className="h-4 w-4" />
			</NavigationMenuLink>
		</NavigationMenuItem>
	);
};

export default CreateProjectMenuItem;
