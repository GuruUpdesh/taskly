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
				collapsible={false}
				minSize={13}
				defaultSize={15}
				maxSize={25}
				className="min-w-200px max-w-400px"
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
