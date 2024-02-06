import {
	dehydrate,
	HydrationBoundary,
	QueryClient,
} from "@tanstack/react-query";
import Tasks from "../../../../../components/page/backlog/tasks";
import { getTasksFromProject } from "~/actions/task-actions";
import BreadCrumbs from "~/components/layout/breadcrumbs/breadcrumbs";
import CreateTask from "~/components/task/create-task";
import { getAsigneesForProject } from "~/actions/project-actions";
import AiDialog from "~/app/(application)/tasks/ai-dialog";

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
					<AiDialog projectId={projectId} />
					<CreateTask projectId={projectId} assignees={assignees} />
				</div>
			</header>
			<section className="flex flex-col pt-4">
				<HydrationBoundary state={dehydrate(queryClient)}>
					<Tasks projectId={projectId} assignees={assignees} />
				</HydrationBoundary>
			</section>
		</div>
	);
}
