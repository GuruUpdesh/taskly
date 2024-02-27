import {
	HydrationBoundary,
	QueryClient,
	dehydrate,
} from "@tanstack/react-query";

import { getTask } from "~/actions/application/task-actions";
import Task from "~/components/task/Task";

type Props = {
	taskId: string;
	projectId: string;
};

export async function TaskWrapper({ taskId, projectId }: Props) {
	const queryClient = new QueryClient();
	await queryClient.prefetchQuery({
		queryKey: ["task", taskId],
		queryFn: () => getTask(parseInt(taskId)),
	});

	return (
		<HydrationBoundary state={dehydrate(queryClient)}>
			<Task taskId={taskId} projectId={projectId} />
		</HydrationBoundary>
	);
}
