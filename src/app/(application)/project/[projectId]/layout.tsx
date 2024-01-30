import React from "react";
import { getProject } from "~/actions/project-actions";
import Sidebar from "~/components/layout/sidebar/sidebar";
import {
	ResizableHandle,
	ResizablePanel,
	ResizablePanelGroup,
} from "~/components/ui/resizable";
import ProjectState from "./project-state";
import SettingsNavigationState from "~/components/layout/sidebar/settings-navigation-state";
import { redirect } from "next/navigation";

type Params = {
	children: React.ReactNode;
	params: {
		projectId: string;
	};
};

export default async function ApplicationLayout({
	children,
	params: { projectId },
}: Params) {
	const result = await getProject(Number(projectId));
	if (!result?.success || !result.project) {
		redirect(`/?error=${result?.message}`);
	}

	return (
		<>
			<ProjectState project={result.project} />
			<ResizablePanelGroup direction="horizontal">
				<ResizablePanel
					id="sidebar"
					minSize={7}
					collapsible={true}
					maxSize={25}
					defaultSize={15}
				>
					<SettingsNavigationState />
					<Sidebar projectId={projectId} />
				</ResizablePanel>
				<ResizableHandle className="" />
				<ResizablePanel defaultSize={75}>
					<main>{children}</main>
				</ResizablePanel>
			</ResizablePanelGroup>
		</>
	);
}
