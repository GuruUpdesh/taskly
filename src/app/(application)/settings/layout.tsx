import React from "react";
import SettingsSidebar from "~/components/page/settings/sidebar/settings-sidebar";
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
			<ResizablePanel defaultSize={85}>
				<main className="flex items-center justify-center">
					<div className=" max-w-[1000px]">{children}</div>
				</main>
			</ResizablePanel>
		</ResizablePanelGroup>
	);
}
