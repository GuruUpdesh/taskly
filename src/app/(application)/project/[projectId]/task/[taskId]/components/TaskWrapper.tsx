import {
	HydrationBoundary,
	QueryClient,
	dehydrate,
} from "@tanstack/react-query";
import { cookies } from "next/headers";

import { getPRStatusFromGithubRepo } from "~/actions/application/github-actions";
import { getTask } from "~/actions/application/task-actions";

import Task from "./Task";

type Props = {
	taskId: string;
	projectId: string;
	context?: "page" | "inbox";
};

export async function TaskWrapper({
	taskId,
	projectId,
	context = "page",
}: Props) {
	const queryClient = new QueryClient();
	await queryClient.prefetchQuery({
		queryKey: ["task", taskId],
		queryFn: () => getTask(parseInt(taskId)),
	});
	const pullRequests = await getPRStatusFromGithubRepo(parseInt(taskId));

	const layout = cookies().get("react-resizable-panels:task-layout");
	let defaultLayout;
	if (layout) {
		defaultLayout = JSON.parse(layout.value) as number[] | undefined;
	}

	return (
		<HydrationBoundary state={dehydrate(queryClient)}>
			<Task
				taskId={taskId}
				projectId={projectId}
				context={context}
				defaultLayout={defaultLayout}
				pullRequests={pullRequests}
			/>
		</HydrationBoundary>
	);
}
