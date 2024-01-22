import React from "react";
import dynamic from "next/dynamic";
const SettingsBackButton = dynamic(() => import("./settings-back-button"), {
	ssr: false,
});
const ProjectSettings = dynamic(() => import("./project-settings"), {
	ssr: false,
});

const SettingsSidebar = () => {
	return (
		<div className="flex h-screen flex-col gap-4 p-4">
			<SettingsBackButton />
			<ProjectSettings />
		</div>
	);
};

export default SettingsSidebar;
