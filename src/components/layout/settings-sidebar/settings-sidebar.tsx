import React from "react";
import dynamic from "next/dynamic";
import SidebarButton from "../sidebar/sidebar-button";
const SettingsBackButton = dynamic(() => import("./settings-back-button"), {
	ssr: false,
});
const ProjectSettings = dynamic(() => import("./project-settings"), {
	ssr: false,
});

const SettingsSidebar = () => {
	return (
		<div className="flex h-screen flex-col gap-4 p-4 @container">
			<SettingsBackButton />
			<div className="flex items-center gap-2 text-sm font-medium leading-none text-muted-foreground">
				<p className="whitespace-nowrap">User Settings</p>
			</div>
			<div>
				<SidebarButton label="Profile" url="/settings/profile" />
			</div>
			<ProjectSettings />
		</div>
	);
};

export default SettingsSidebar;
