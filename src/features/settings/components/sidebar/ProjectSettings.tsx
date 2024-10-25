"use client";

import React from "react";

import { GearIcon } from "@radix-ui/react-icons";

import SidebarButton from "~/app/components/layout/sidebar/sidebar-button";
import { useRealtimeStore } from "~/store/realtime";

const ProjectSettings = () => {
	const project = useRealtimeStore((state) => state.project);

	if (!project) return null;

	return (
		<SidebarButton
			label="Project Settings"
			icon={<GearIcon />}
			url={`/settings/project/${project.id}/general`}
		/>
	);
};

export default ProjectSettings;
