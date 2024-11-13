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

import { getAssigneesForProject, getProject } from "~/actions/project-actions";
import { getSprintsForProject } from "~/actions/sprint-actions";
import AppSidebar from "~/components/layout/sidebar/AppSidebar";
import { SidebarProvider } from "~/components/ui/sidebar";
import { getAiLimitCount } from "~/features/ai/actions/ai-limit-actions";
import { getAllNotifications } from "~/features/notifications/actions/notification-actions";
import constructToastURL from "~/lib/toast/global-toast-url-constructor";

import ProjectState from "./project-state";

type Params = {
	children: React.ReactNode;
	params: {
		projectId: string;
	};
};

export function generateMetadata(): Metadata {
	return {
		title: {
			default: "Taskly",
			template: "Taskly > %s",
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
		queryKey: ["project", projectIdInt],
		queryFn: () => getProject(projectIdInt, user.id),
	});
	await queryClient.prefetchQuery({
		queryKey: ["assignees/sprints", projectIdInt],
		queryFn: async () => {
			const assignees = await getAssigneesForProject(projectIdInt);
			const sprints = await getSprintsForProject(projectIdInt);

			return { assignees, sprints };
		},
	});
	await queryClient.prefetchQuery({
		queryKey: ["notifications", projectIdInt],
		queryFn: async () => {
			const result = await getAllNotifications(user.id);
			if (result.error !== null) {
				console.error(result.error);
				return [];
			}
			return result.data;
		},
	});

	const aiUsageCount = await getAiLimitCount();

	const defaultOpen = cookies().get("sidebar:state")?.value === "true";

	return (
		<HydrationBoundary state={dehydrate(queryClient)}>
			<ProjectState
				projectId={projectIdInt}
				userId={user.id}
				aiUsageCount={aiUsageCount}
			/>
			<SidebarProvider defaultOpen={defaultOpen}>
				<AppSidebar projectId={projectId} />
				<main className="mt-4 flex h-[calc(100svh-1rem)] w-full flex-1 flex-col rounded-tl-2xl border-l border-t bg-accent/25">
					{children}
				</main>
			</SidebarProvider>
		</HydrationBoundary>
	);
}
