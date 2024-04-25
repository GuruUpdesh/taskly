import { PlusCircledIcon } from "@radix-ui/react-icons";
import {
	dehydrate,
	HydrationBoundary,
	QueryClient,
} from "@tanstack/react-query";
import { type Metadata } from "next";

import { getTasksFromProject } from "~/actions/application/task-actions";
import CreateTask from "~/components/backlog/create-task";
import CreateTicket from "~/components/create-ticket/ticket";
import Filters from "~/components/filter/filters";
import BreadCrumbs from "~/components/layout/breadcrumbs/breadcrumbs";
import ToggleSidebarButton from "~/components/layout/sidebar/toggle-sidebar-button";
import { Button } from "~/components/ui/button";

import AiDialog from "../components/AiDialog";
import FilterAndGroupToggles from "../components/FilterAndGroupToggles";
import TasksContainer from "../components/TasksContainer";

export const metadata: Metadata = {
	title: "Board",
};

type Params = {
	params: {
		projectId: string;
	};
};

/**
 * This is a copy of backlog page until I have a better solution
 *  */
export default async function BacklogPage({ params: { projectId } }: Params) {
	// Prefetch tasks using react-query
	const queryClient = new QueryClient();
	await queryClient.prefetchQuery({
		queryKey: ["tasks", projectId],
		queryFn: () => getTasksFromProject(parseInt(projectId)),
	});

	return (
		<div className="flex max-h-screen min-h-screen flex-col">
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
			<Filters />
			<section className="flex h-full flex-col overflow-hidden">
				<HydrationBoundary state={dehydrate(queryClient)}>
					<TasksContainer projectId={projectId} variant="board" />
				</HydrationBoundary>
			</section>
			<CreateTicket />
		</div>
	);
}
