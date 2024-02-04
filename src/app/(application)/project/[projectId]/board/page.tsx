import {
	dehydrate,
	HydrationBoundary,
	QueryClient,
} from "@tanstack/react-query";
import { getTasksFromProject } from "~/actions/task-actions";
import BreadCrumbs from "~/components/layout/breadcrumbs/breadcrumbs";
import { Bot } from "lucide-react";
import { Button } from "~/components/ui/button";
import CreateTask from "~/components/backlog/create-task";
import { getAsigneesForProject } from "~/actions/project-actions";
import dynamic from "next/dynamic";
const TaskBoard = dynamic(() => import("./board"), { ssr: false });

type Params = {
	params: {
		projectId: string;
	};
};

export default async function BacklogPage({ params: { projectId } }: Params) {
	const assignees = await getAsigneesForProject(parseInt(projectId));

	// Prefetch tasks using react-query
	const queryClient = new QueryClient();
	await queryClient.prefetchQuery({
		queryKey: ["tasks"],
		queryFn: () => getTasksFromProject(parseInt(projectId)),
	});

	return (
		<div className="max-h-screen overflow-y-scroll pt-2">
			<header className="container flex items-center justify-between gap-2 border-b pb-2">
				<BreadCrumbs />
				<div className="flex items-center gap-2">
					<Button variant="outline" size="sm">
						<Bot className="h-4 w-4" />
					</Button>
					<CreateTask projectId={projectId} assignees={assignees} />
				</div>
			</header>
			<section className="container flex flex-col pt-4">
				<HydrationBoundary state={dehydrate(queryClient)}>
					<TaskBoard projectId={projectId} assignees={assignees} />
				</HydrationBoundary>
			</section>
		</div>
	);
}
