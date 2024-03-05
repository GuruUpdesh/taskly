"use client";

import React from "react";

import { ChevronRight, Plus } from "lucide-react";

import ProjectImage from "~/components/page/project/project-image";
import { Button } from "~/components/ui/button";
import {
	NavigationMenuContent,
	NavigationMenuItem,
	NavigationMenuLink,
	NavigationMenuTrigger,
} from "~/components/ui/navigation-menu";
import { type Project } from "~/server/db/schema";

type ProjectMenuItemProps = {
	projects: Project[];
};

const ProjectMenuItem = ({ projects }: ProjectMenuItemProps) => {
	return (
		<NavigationMenuItem>
			<NavigationMenuTrigger className="text-base">
				Projects
			</NavigationMenuTrigger>
			<NavigationMenuContent>
				<ul className="grid grid-cols-[1fr_1fr_1fr] gap-3 p-4">
					{projects.map((project) => (
						<NavigationMenuLink
							key={project.id}
							href={`/project/${project.id}/backlog`}
							className="min-w-max "
						>
							<Button
								variant="outline"
								className="w-full items-center justify-between gap-1 whitespace-nowrap"
							>
								<ProjectImage project={project} />
								<span className="mx-1">{project.name}</span>
								<ChevronRight className="h-4 w-4" />
							</Button>
						</NavigationMenuLink>
					))}
				</ul>
				<NavigationMenuLink
					href="create-project"
					className="mx-2 mb-2 flex min-w-max items-center gap-1"
				>
					<Button
						variant="outline"
						className="w-full items-center justify-between gap-1 whitespace-nowrap"
					>
						Create Project
						<Plus className="h-4 w-4" />
					</Button>
				</NavigationMenuLink>
			</NavigationMenuContent>
		</NavigationMenuItem>
	);
};

export default ProjectMenuItem;
