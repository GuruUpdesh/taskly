"use client";

import React from "react";
import { type Project } from "~/server/db/schema";
import {
	NavigationMenuContent,
	NavigationMenuItem,
	NavigationMenuLink,
	NavigationMenuTrigger,
} from "~/components/ui/navigation-menu";
import { Plus } from "lucide-react";

type ProjectMenuItemProps = {
	projects: Project[];
};

const ProjectMenuItem = ({ projects }: ProjectMenuItemProps) => {
	console.log("projects", projects);
	return (
		<NavigationMenuItem>
			<NavigationMenuTrigger>Projects</NavigationMenuTrigger>
			<NavigationMenuContent className="absolute left-0 top-0 w-full">
				<ul className="grid w-[200px] gap-3 p-4 md:grid-cols-1">
					{projects.map((project) => (
						<NavigationMenuLink
							key={project.id}
							href={`/project/${project.id}/backlog`}
						>
							{project.name}
						</NavigationMenuLink>
					))}
					<NavigationMenuLink
						href="create-project"
						className="flex items-center gap-1"
					>
						<Plus className="h-4 w-4" />
						Create Project
					</NavigationMenuLink>
				</ul>
			</NavigationMenuContent>
		</NavigationMenuItem>
	);
};

export default ProjectMenuItem;
