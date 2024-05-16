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

	const layout = cookies().get("react-resizable-panels:task-layout");
	let defaultLayout;
	if (layout) {
		defaultLayout = JSON.parse(layout.value) as number[] | undefined;
	}

	return (
		<HydrationBoundary state={dehydrate(queryClient)}>
			<Task
				taskId={taskIdInt}
				projectId={projectId}
				context={context}
				defaultLayout={defaultLayout}
			/>
		</HydrationBoundary>
	);
}
