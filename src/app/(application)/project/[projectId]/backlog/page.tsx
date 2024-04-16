import {
	dehydrate,
	HydrationBoundary,
	QueryClient,
} from "@tanstack/react-query";

import { getTasksFromProject } from "~/actions/application/task-actions";
import CreateTask from "~/components/backlog/create-task";
import Tasks from "~/components/backlog/tasks";
import CreateTicket from "~/components/create-ticket/ticket";
import Filters from "~/components/filter/filters";
import BreadCrumbs from "~/components/layout/breadcrumbs/breadcrumbs";
import ToggleSidebarButton from "~/components/layout/sidebar/toggle-sidebar-button";
import AiDialog from "~/components/page/backlog/dialogs/ai-dialog";
import ToggleFilters from "~/components/page/backlog/display-toggles";
import { Button } from "~/components/ui/button";

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
					<ToggleFilters />
					<AiDialog projectId={projectId} />
					<CreateTask projectId={projectId}>
						<Button className="gap-1 font-bold" size="sm">
							New Task
						</Button>
					</CreateTask>
				</div>
			</header>
			<section className="flex flex-1 flex-col">
				<Filters />
				<HydrationBoundary state={dehydrate(queryClient)}>
					<Tasks projectId={projectId} />
				</HydrationBoundary>
			</section>
			<CreateTicket />
		</div>
	);
}
