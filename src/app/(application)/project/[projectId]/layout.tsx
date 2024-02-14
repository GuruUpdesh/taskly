import React from "react";
import { getProject } from "~/actions/project-actions";
import Sidebar from "~/components/layout/sidebar/sidebar";
import ProjectState from "./project-state";
import { redirect } from "next/navigation";
import SidebarPanel from "~/components/layout/sidebar/sidebar-panel";
import { cookies } from "next/headers";
import constructToastURL from "~/lib/global-toast/global-toast-url-constructor";

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
		if (result?.message) {
			redirect(constructToastURL(result.message, "error"));
		}
		redirect(constructToastURL("Issue loading project", "error"));
	}

	const layout = cookies().get("react-resizable-panels:layout");
	let defaultLayout;
	if (layout) {
		defaultLayout = JSON.parse(layout.value) as number[] | undefined;
	}

	return (
		<>
			<ProjectState project={result.project} />
			<SidebarPanel
				sidebarComponent={<Sidebar projectId={projectId} />}
				defaultLayout={defaultLayout}
			>
				<main>{children}</main>
			</SidebarPanel>
		</>
	);
}
