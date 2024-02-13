"use client";

import React from "react";
import { type Project } from "~/server/db/schema";
import {
	NavigationMenuContent,
	NavigationMenuItem,
	NavigationMenuLink,
	NavigationMenuTrigger,
} from "~/components/ui/navigation-menu";
import { ChevronRight, Plus } from "lucide-react";
import { Button } from "~/components/ui/button";
import ProjectImage from "~/components/page/project/project-image";

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
							className="min-w-max"
						>
							<Button
								variant="outline"
								className="w-full items-center justify-between gap-1 whitespace-nowrap"
							>
								<ProjectImage project={project} />
								{project.name}
								<ChevronRight className="h-4 w-4" />
							</Button>
						</NavigationMenuLink>
					))}
				</ul>
				<NavigationMenuLink
					href="create-project"
					className="flex min-w-max items-center gap-1 mb-2 mx-2"
				>
					<Button className="w-full items-center justify-between gap-1 whitespace-nowrap">
						Create Project
						<Plus className="h-4 w-4" />
					</Button>
				</NavigationMenuLink>
			</NavigationMenuContent>
		</NavigationMenuItem>
	);
};

export default ProjectMenuItem;
