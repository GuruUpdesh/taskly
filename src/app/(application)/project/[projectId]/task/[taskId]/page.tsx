import {
	HydrationBoundary,
	QueryClient,
	dehydrate,
} from "@tanstack/react-query";
import { getAssigneesForProject } from "~/actions/project-actions";
import { getSprintsForProject } from "~/actions/sprint-actions";
import { getTask } from "~/actions/task-actions";
import Task from "~/components/task/Task";

type Params = {
	params: {
		taskId: string;
		projectId: string;
	};
};

export default async function TaskPage({
	params: { taskId, projectId },
}: Params) {
	const assignees = await getAssigneesForProject(parseInt(projectId));
	const sprints = await getSprintsForProject(parseInt(projectId));

	// Prefetch task using react-query
	const queryClient = new QueryClient();
	await queryClient.prefetchQuery({
		queryKey: ["task", taskId],
		queryFn: () => getTask(parseInt(taskId)),
	});

	return (
		<div className="max-h-screen overflow-y-scroll">
			<HydrationBoundary state={dehydrate(queryClient)}>
				<Task taskId={taskId} assignees={assignees} sprints={sprints} />
			</HydrationBoundary>
		</div>
	);
}
