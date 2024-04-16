import React from "react";

import {
	dehydrate,
	HydrationBoundary,
	QueryClient,
} from "@tanstack/react-query";
import { cookies } from "next/headers";

import {
	getAssigneesForProject,
	getProject,
} from "~/actions/application/project-actions";
import { getSprintsForProject } from "~/actions/application/sprint-actions";
import { getAllNotifications } from "~/actions/notification-actions";
import { authenticate } from "~/actions/security/authenticate";
import Sidebar from "~/components/layout/sidebar/sidebar";
import SidebarPanel from "~/components/layout/sidebar/sidebar-panel";

import ProjectState from "./project-state";

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
	const userId = authenticate();

	const queryClient = new QueryClient();
	await queryClient.prefetchQuery({
		queryKey: ["project", projectId],
		queryFn: () => getProject(Number(projectId)),
	});
	await queryClient.prefetchQuery({
		queryKey: ["assignees/sprints", projectId],
		queryFn: async () => {
			const assignees = await getAssigneesForProject(parseInt(projectId));
			const sprints = await getSprintsForProject(parseInt(projectId));

			return { assignees, sprints };
		},
	});
	await queryClient.prefetchQuery({
		queryKey: ["notifications", projectId],
		queryFn: () => getAllNotifications(userId),
	});

	const layout = cookies().get("react-resizable-panels:layout");
	let defaultLayout;
	if (layout) {
		defaultLayout = JSON.parse(layout.value) as number[] | undefined;
	}

	return (
		<HydrationBoundary state={dehydrate(queryClient)}>
			<ProjectState projectId={projectId} userId={userId} />
			<SidebarPanel
				sidebarComponent={<Sidebar projectId={projectId} />}
				defaultLayout={defaultLayout}
			>
				<main className="flex h-full w-full flex-1 flex-col">
					{children}
				</main>
			</SidebarPanel>
		</HydrationBoundary>
	);
}
