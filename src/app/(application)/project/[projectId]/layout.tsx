import React from "react";

import { currentUser } from "@clerk/nextjs/server";
import {
	dehydrate,
	HydrationBoundary,
	QueryClient,
} from "@tanstack/react-query";
import { type Metadata } from "next";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import {
	getAssigneesForProject,
	getProject,
} from "~/actions/application/project-actions";
import { getSprintsForProject } from "~/actions/application/sprint-actions";
import { getAllNotifications } from "~/actions/notification-actions";
import Sidebar from "~/app/components/layout/sidebar/sidebar";
import SidebarPanel from "~/app/components/layout/sidebar/sidebar-panel";
import constructToastURL from "~/lib/toast/global-toast-url-constructor";

import ProjectState from "./project-state";

type Params = {
	children: React.ReactNode;
	params: {
		projectId: string;
	};
};

export async function generateMetadata({
	params: { projectId },
}: Params): Promise<Metadata> {
	const projectResults = await getProject(Number(projectId));
	if (!projectResults || !projectResults.success || !projectResults.project) {
		return {
			title: {
				default: "Project",
				template: "%s | Taskly",
			},
		};
	}

	return {
		title: {
			default: projectResults.project.name,
			template: `%s > ${projectResults.project.name} | Taskly`,
		},
	};
}

export default async function ApplicationLayout({
	children,
	params: { projectId },
}: Params) {
	const user = await currentUser();
	if (!user) {
		redirect(
			constructToastURL(
				"You need to be logged in to view the application",
				"error",
			),
		);
	}

	const projectIdInt = parseInt(projectId, 10);

	// prefetch the project, assignees, sprints, and notifications
	const queryClient = new QueryClient();
	await queryClient.prefetchQuery({
		queryKey: ["project", projectId],
		queryFn: () => getProject(projectIdInt),
	});
	await queryClient.prefetchQuery({
		queryKey: ["assignees/sprints", projectId],
		queryFn: async () => {
			const assignees = await getAssigneesForProject(projectIdInt);
			const sprints = await getSprintsForProject(projectIdInt);

			return { assignees, sprints };
		},
	});
	await queryClient.prefetchQuery({
		queryKey: ["notifications", projectId],
		queryFn: () => getAllNotifications(user.id),
	});

	// get the layout from cookies (for consistent ssr)
	const layout = cookies().get("react-resizable-panels:layout");
	let defaultLayout;
	if (layout) {
		defaultLayout = JSON.parse(layout.value) as number[] | undefined;
	}

	return (
		<HydrationBoundary state={dehydrate(queryClient)}>
			<ProjectState projectId={projectId} userId={user.id} />
			<SidebarPanel
				sidebarComponent={<Sidebar projectId={projectId} />}
				defaultLayout={defaultLayout}
			>
				<main className="flex h-full w-full flex-1 flex-col bg-accent/25">
					{children}
				</main>
			</SidebarPanel>
		</HydrationBoundary>
	);
}
