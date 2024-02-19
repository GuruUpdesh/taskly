import {
	dehydrate,
	HydrationBoundary,
	QueryClient,
} from "@tanstack/react-query";
import Tasks from "~/components/backlog/tasks";
import { getTasksFromProject } from "~/actions/application/task-actions";
import BreadCrumbs from "~/components/layout/breadcrumbs/breadcrumbs";
import CreateTask from "~/components/backlog/create-task";
import { getAssigneesForProject } from "~/actions/application/project-actions";
import AiDialog from "~/components/page/backlog/dialogs/ai-dialog";
import { getSprintsForProject } from "~/actions/application/sprint-actions";
import ToggleSidebarButton from "~/components/layout/sidebar/toggle-sidebar-button";
import { Button } from "~/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "~/components/ui/dialog"
import { Input } from "~/components/ui/input"
import { Label } from "~/components/ui/label"
import CreateTicket from "~/components/create-ticket/ticket";

type Params = {
	params: {
		projectId: string;
	};
};

export default async function BacklogPage({ params: { projectId } }: Params) {
	const assignees = await getAssigneesForProject(parseInt(projectId));
	const sprints = await getSprintsForProject(parseInt(projectId));
	// Prefetch tasks using react-query
	const queryClient = new QueryClient();
	await queryClient.prefetchQuery({
		queryKey: ["tasks"],
		queryFn: () => getTasksFromProject(parseInt(projectId)),
	});


	return (
		<div className="max-h-screen overflow-y-scroll">
			<header className="sticky top-0 z-50 flex items-center justify-between gap-2 border-b bg-background/75 px-4 pb-2 pt-2 backdrop-blur-xl">
				<div className="flex items-center gap-2">
					<ToggleSidebarButton />
					<BreadCrumbs />
				</div>
				<div className="flex items-center gap-2">
					<AiDialog projectId={projectId} />
					<CreateTask
						projectId={projectId}
						assignees={assignees}
						sprints={sprints}
					/>
				</div>
			</header>
			<section className="flex flex-col">
				<HydrationBoundary state={dehydrate(queryClient)}>
					<Tasks
						projectId={projectId}
						assignees={assignees}
						sprints={sprints}
					/>
				</HydrationBoundary>
			</section>
			<CreateTicket/>
		</div>
	);
}
