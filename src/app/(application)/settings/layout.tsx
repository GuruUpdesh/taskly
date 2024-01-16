import React from "react";
import SettingsSidebar from "~/components/layout/settings-sidebar/settings-sidebar";
import {
	ResizableHandle,
	ResizablePanel,
	ResizablePanelGroup,
} from "~/components/ui/resizable";

export default function SettingsLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<ResizablePanelGroup direction="horizontal">
			<ResizablePanel
				id="sidebar"
				minSize={7}
				collapsible={true}
				maxSize={25}
				defaultSize={15}
			>
				<SettingsSidebar />
			</ResizablePanel>
			<ResizableHandle />
			<ResizablePanel defaultSize={75}>
				<main>{children}</main>
			</ResizablePanel>
		</ResizablePanelGroup>
	);
}
