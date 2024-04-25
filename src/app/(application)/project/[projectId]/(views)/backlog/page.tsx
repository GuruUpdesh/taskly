import { PlusCircledIcon } from "@radix-ui/react-icons";
import {
	dehydrate,
	HydrationBoundary,
	QueryClient,
} from "@tanstack/react-query";
import { type Metadata } from "next";

import { getTasksFromProject } from "~/actions/application/task-actions";
import CreateTask from "~/components/backlog/create-task";
import BreadCrumbs from "~/components/layout/breadcrumbs/breadcrumbs";
import ToggleSidebarButton from "~/components/layout/sidebar/toggle-sidebar-button";
import { Button } from "~/components/ui/button";

import AiDialog from "../components/AiDialog";
import CreateGithubTicket from "../components/CreateGithubTicket";
import Filters from "../components/filter/Filters";
import FilterAndGroupToggles from "../components/FilterAndGroupToggles";
import TasksContainer from "../components/TasksContainer";

export const metadata: Metadata = {
	title: "Backlog",
};

type Params = {
	params: {
		projectId: string;
	};
};

export default async function BacklogPage({ params: { projectId } }: Params) {
	// Prefetch tasks using react-query
	const queryClient = new QueryClient();
	await queryClient.prefetchQuery({
		queryKey: ["tasks", projectId],
		queryFn: () => getTasksFromProject(parseInt(projectId)),
	});

	return (
		<div className="relative flex max-h-screen flex-1 flex-col overflow-y-scroll">
			<header className="sticky top-0 z-50 flex items-center justify-between gap-2 border-b px-4 pb-2 pt-2 backdrop-blur-xl">
				<div className="flex items-center gap-2">
					<ToggleSidebarButton />
					<BreadCrumbs />
				</div>
				<div className="flex items-center gap-2">
					<FilterAndGroupToggles />
					<AiDialog projectId={projectId} />
					<CreateTask projectId={projectId}>
						<Button
							className="gap-1 font-bold"
							size="sm"
							variant="secondary"
						>
							<PlusCircledIcon />
							New Task
						</Button>
					</CreateTask>
				</div>
			</header>
			<section className="flex flex-1 flex-col">
				<Filters />
				<HydrationBoundary state={dehydrate(queryClient)}>
					<TasksContainer projectId={projectId} />
				</HydrationBoundary>
			</section>
			<CreateGithubTicket />
		</div>
	);
}
