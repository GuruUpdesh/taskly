import {
	HydrationBoundary,
	QueryClient,
	dehydrate,
} from "@tanstack/react-query";
import { cookies } from "next/headers";

import { getTask } from "~/actions/application/task-actions";
import Task from "~/components/task/Task";

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

	const layout = cookies().get("react-resizable-panels:task-layout");
	let defaultLayout;
	if (layout) {
		defaultLayout = JSON.parse(layout.value) as number[] | undefined;
	}

	console.log("defaultLayout", defaultLayout);

	return (
		<HydrationBoundary state={dehydrate(queryClient)}>
			<Task
				taskId={taskId}
				projectId={projectId}
				context={context}
				defaultLayout={defaultLayout}
			/>
		</HydrationBoundary>
	);
}
