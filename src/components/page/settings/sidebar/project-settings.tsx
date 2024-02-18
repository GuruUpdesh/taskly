"use client";

import React, { useMemo } from "react";
import { useNavigationStore } from "~/store/navigation";
import SidebarButton from "~/components/layout/sidebar/sidebar-button";
import { generalSettings } from "~/config/settings-config";
import SettingsSidebarSubButton from "./settings-sidebar-sub-button";
import { usePathname } from "next/navigation";
import { cn } from "~/lib/utils";

const ProjectSettings = () => {
	const project = useNavigationStore((state) => state.currentProject);
	const url = `/settings/project/${project?.id ?? -1}/general`;
	const pathname = usePathname();
	const active = useMemo(() => pathname === url, [pathname, url]);

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
				<ul
					className={cn("flex flex-col overflow-hidden pl-8", {
						"max-h-0": !active,
					})}
				>
					{generalSettings.map((settings, index) => (
						<SettingsSidebarSubButton
							key={index}
							label={settings.title}
							anchor={settings.anchor}
							icon={settings.icon}
						/>
					))}
				</ul>
			</div>
		</>
	);
};

export default ProjectSettings;
