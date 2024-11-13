import {
	HydrationBoundary,
	QueryClient,
	dehydrate,
} from "@tanstack/react-query";

import { getTask } from "~/actions/task-actions";
import { getPRStatusFromGithubRepo } from "~/features/github-integration/actions/get-pr-status-from-github-repo";

import TaskPage from "./TaskPage";

type Props = {
	taskId: string;
	projectId: string;
	context?: "page" | "inbox";
};

export async function TaskPageWrapper({
	taskId,
	projectId,
	context = "page",
}: Props) {
	const taskIdInt = parseInt(taskId, 10);

	const queryClient = new QueryClient();
	await queryClient.prefetchQuery({
		queryKey: ["task", taskIdInt],
		queryFn: () => getTask(taskIdInt),
	});
	await queryClient.prefetchQuery({
		queryKey: ["task-pr", taskIdInt],
		queryFn: () => getPRStatusFromGithubRepo(taskIdInt),
	});

	return (
		<HydrationBoundary state={dehydrate(queryClient)}>
			<TaskPage
				taskId={taskIdInt}
				projectId={projectId}
				context={context}
			/>
		</HydrationBoundary>
	);
}
