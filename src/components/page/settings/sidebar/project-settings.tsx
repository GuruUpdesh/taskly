"use client";

import React, { useMemo } from "react";
import { useNavigationStore } from "~/store/navigation";
import SidebarButton from "~/components/layout/sidebar/sidebar-button";
import { generalSettings } from "~/config/settings-config";
import SettingsSidebarSubButton from "./settings-sidebar-sub-button";
import { usePathname } from "next/navigation";
import { cn } from "~/lib/utils";
import { GearIcon } from "@radix-ui/react-icons";

const ProjectSettings = () => {
	const project = useNavigationStore((state) => state.currentProject);
	const url = `/settings/project/${project?.id ?? -1}/general`;
	const pathname = usePathname();
	const active = useMemo(() => pathname === url, [pathname, url]);

	if (!project) return null;

	return (
		<div>
			<SidebarButton
				label="Project Settings"
				icon={<GearIcon />}
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
	);
};

export default ProjectSettings;
