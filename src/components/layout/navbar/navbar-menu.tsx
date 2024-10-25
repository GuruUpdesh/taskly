"use client";

import React from "react";

import { useAuth } from "@clerk/nextjs";
import { ArrowRight, Plus } from "lucide-react";
import Image from "next/image";

import { Button } from "~/components/ui/button";
import {
	NavigationMenu,
	NavigationMenuItem,
	NavigationMenuLink,
	NavigationMenuList,
	NavigationMenuContent,
	NavigationMenuTrigger,
} from "~/components/ui/navigation-menu";
import { cn } from "~/lib/utils";
import { type Project } from "~/server/db/schema";

type NavbarProps = {
	children: React.ReactNode;
};

const NavbarMenu = ({ children }: NavbarProps) => {
	return (
		<NavigationMenu className="hidden justify-between md:flex">
			<NavigationMenuList>{children}</NavigationMenuList>
		</NavigationMenu>
	);
};

export const RecentTaskMenuItem = ({ children }: NavbarProps) => {
	const { isLoaded, userId } = useAuth();

	if (!isLoaded || !userId) {
		return null;
	}

	return (
		<NavigationMenuItem>
			<NavigationMenuTrigger className="bg-transparent text-base font-normal">
				Recent Tasks
			</NavigationMenuTrigger>
			<NavigationMenuContent className="flex gap-4 !border-foreground/10 !bg-background/75 p-2 !backdrop-blur-2xl">
				<div className="min-w-[350px] max-w-[450px] pr-2">
					{children}
				</div>
			</NavigationMenuContent>
		</NavigationMenuItem>
	);
};

export const CreateProjectMenuItem = () => {
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

type ProjectsMenuItemProps = {
	projects: Project[];
};

export const ProjectsMenuItem = ({ projects }: ProjectsMenuItemProps) => {
	return (
		<NavigationMenuItem>
			<NavigationMenuTrigger className="text-base font-normal">
				Projects
			</NavigationMenuTrigger>
			<NavigationMenuContent className="min-w-[300px] p-2">
				<ul className="flex flex-col gap-1">
					{projects.map((project, idx) => (
						<NavigationMenuLink
							key={project.id}
							href={`/project/${project.id}/tasks`}
							className="min-w-max "
						>
							<Button
								variant="outline"
								className={cn(
									"w-full items-center justify-between gap-1 whitespace-nowrap px-1",
									"group relative cursor-pointer gap-2 overflow-hidden rounded-none !bg-transparent font-semibold text-foreground/75",
									"bg-gradient-to-r from-background to-transparent to-50% bg-[length:200%] bg-left transition-all duration-300 ease-linear hover:bg-right",
									{
										"rounded-t-md": idx === 0,
									},
								)}
							>
								<span className="mx-1">{project.name}</span>
								<div className="absolute left-0 aspect-square w-full opacity-50 transition-opacity gradient-mask-l-50 group-hover:opacity-75  group-focus:opacity-75">
									{project.image ? (
										<Image
											src={
												project.image ?? "/project.svg"
											}
											alt={project.name}
											fill
										/>
									) : null}
								</div>
								<span className="group-focus-opacity-100 absolute right-2 opacity-0 transition-opacity group-hover:opacity-100">
									<ArrowRight className="h-4 w-4" />
								</span>
							</Button>
						</NavigationMenuLink>
					))}
					<NavigationMenuLink
						href="create-project"
						className="flex min-w-max items-center gap-1"
					>
						<Button
							variant="outline"
							className="w-full items-center justify-between gap-1 whitespace-nowrap rounded-t-none px-2"
						>
							Create Project
							<Plus className="h-4 w-4" />
						</Button>
					</NavigationMenuLink>
				</ul>
			</NavigationMenuContent>
		</NavigationMenuItem>
	);
};

export default NavbarMenu;
