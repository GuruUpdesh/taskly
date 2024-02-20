import React from "react";
import { getProject } from "~/actions/application/project-actions";
import Sidebar from "~/components/layout/sidebar/sidebar";
import ProjectState from "./project-state";
import { redirect } from "next/navigation";
import SidebarPanel from "~/components/layout/sidebar/sidebar-panel";
import { cookies } from "next/headers";
import constructToastURL from "~/lib/global-toast/global-toast-url-constructor";
import GlobalSearch from "~/components/global-search/kbar";
import { getTasksFromProject } from "~/actions/application/task-actions";
import {
	HydrationBoundary,
	QueryClient,
	dehydrate,
} from "@tanstack/react-query";

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

	const queryClient = new QueryClient();
	await queryClient.prefetchQuery({
		queryKey: ["tasks"],
		queryFn: () => getTasksFromProject(parseInt(projectId)),
	});

	return (
		<>
			<ProjectState project={result.project} />
			<SidebarPanel
				sidebarComponent={<Sidebar projectId={projectId} />}
				defaultLayout={defaultLayout}
			>
				<main>
					<HydrationBoundary state={dehydrate(queryClient)}>
						<GlobalSearch projectId={parseInt(projectId)} />
					</HydrationBoundary>
					{children}
				</main>
			</SidebarPanel>
		</>
	);
}
