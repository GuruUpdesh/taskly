import {
	HydrationBoundary,
	QueryClient,
	dehydrate,
} from "@tanstack/react-query";
import { getAssigneesForProject } from "~/actions/application/project-actions";
import { getSprintsForProject } from "~/actions/application/sprint-actions";
import { getTask } from "~/actions/application/task-actions";
import Task from "~/components/task/Task";

type Props = {
	taskId: string;
	projectId: string;
};

export async function TaskWrapper({ taskId, projectId }: Props) {
	const assignees = await getAssigneesForProject(parseInt(projectId));
	const sprints = await getSprintsForProject(parseInt(projectId));

	const queryClient = new QueryClient();
	await queryClient.prefetchQuery({
		queryKey: ["task", taskId],
		queryFn: () => getTask(parseInt(taskId)),
	});

	return (
		<HydrationBoundary state={dehydrate(queryClient)}>
			<Task taskId={taskId} assignees={assignees} sprints={sprints} />
		</HydrationBoundary>
	);
}
