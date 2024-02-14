"use client";

import React from "react";
import { useNavigationStore } from "~/store/navigation";
import SidebarButton from "~/components/layout/sidebar/sidebar-button";

const ProjectSettings = () => {
	const project = useNavigationStore((state) => state.currentProject);
	if (!project) return null;

	return (
		<>
			<div className="flex items-center gap-2 text-sm font-medium leading-none text-muted-foreground">
				<p className="whitespace-nowrap">Project Settings</p>
				<p className="whitespace-nowrap rounded-sm bg-accent p-1 px-2">
					{project.name}
				</p>
			</div>
			<div>
				<SidebarButton
					label="General"
					url={`/settings/project/${project.id}/general`}
				/>
			</div>
		</>
	);
};

export default ProjectSettings;
