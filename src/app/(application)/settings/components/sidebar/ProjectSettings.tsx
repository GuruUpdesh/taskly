"use client";

import React, { useMemo } from "react";

import { GearIcon } from "@radix-ui/react-icons";
import { usePathname } from "next/navigation";

import SidebarButton from "~/app/components/layout/sidebar/sidebar-button";
import { Separator } from "~/components/ui/separator";
import { generalSettings } from "~/config/settingsConfig";
import { cn } from "~/lib/utils";
import { useNavigationStore } from "~/store/navigation";

import SettingsSidebarSubButton from "./SettingsSidebarSubButton";

const ProjectSettings = () => {
	const project = useNavigationStore((state) => state.currentProject);
	const url = `/settings/project/${project?.id ?? -1}/general`;
	const pathname = usePathname();
	const active = useMemo(() => pathname === url, [pathname, url]);

	if (!project) return null;

	return (
		<>
			<Separator className="mb-4" />
			<div>
				<SidebarButton
					label="Project Settings"
					icon={<GearIcon />}
					url={`/settings/project/${project.id}/general`}
				/>
				<ul
					className={cn(
						"hidden flex-col overflow-hidden pl-8 lg:flex",
						{
							"max-h-0": !active,
						},
					)}
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
