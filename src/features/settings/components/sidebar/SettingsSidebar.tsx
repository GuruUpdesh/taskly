import React from "react";

import { PersonIcon } from "@radix-ui/react-icons";
import dynamic from "next/dynamic";

import SidebarButton from "~/app/components/layout/sidebar/sidebar-button";
const ProjectSettings = dynamic(() => import("./ProjectSettings"), {
	ssr: false,
});

const SettingsSidebar = () => {
	return (
		<div className="flex flex-col gap-4 @container">
			<div className="px-4">
				<SidebarButton
					icon={<PersonIcon />}
					label="Account"
					url={["/settings/account", "/settings/account/security"]}
				/>
				<ProjectSettings />
			</div>
		</div>
	);
};

export default SettingsSidebar;
