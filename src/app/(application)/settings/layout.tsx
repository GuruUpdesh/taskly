import React from "react";

import { type Metadata } from "next";
import { cookies } from "next/headers";

import SettingsSidebar from "~/app/(application)/settings/components/sidebar/SettingsSidebar";

import SettingsPanel from "./settings-panel";

export const metadata: Metadata = {
	title: "Settings",
};

export default function SettingsLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	const layout = cookies().get("react-resizable-panels:settings-layout");
	let defaultLayout;
	if (layout) {
		defaultLayout = JSON.parse(layout.value) as number[] | undefined;
	}

	return (
		<SettingsPanel
			sidebarChildren={<SettingsSidebar />}
			defaultLayout={defaultLayout}
		>
			<div className="flex items-center justify-center overflow-scroll">
				<div className="max-w-[1000px]">{children}</div>
			</div>
		</SettingsPanel>
	);
}
