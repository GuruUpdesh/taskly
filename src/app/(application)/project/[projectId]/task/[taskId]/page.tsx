import {
	HydrationBoundary,
	QueryClient,
	dehydrate,
} from "@tanstack/react-query";

import { getTask } from "~/actions/application/task-actions";
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
	// Prefetch task using react-query
	const queryClient = new QueryClient();
	await queryClient.prefetchQuery({
		queryKey: ["task", taskId],
		queryFn: () => getTask(parseInt(taskId)),
	});

	return (
		<div className="max-h-screen overflow-y-scroll">
			<HydrationBoundary state={dehydrate(queryClient)}>
				<Task taskId={taskId} projectId={projectId} />
			</HydrationBoundary>
		</div>
	);
}
