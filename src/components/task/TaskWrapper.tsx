import {
	HydrationBoundary,
	QueryClient,
	dehydrate,
} from "@tanstack/react-query";
import { eq } from "drizzle-orm";

import { getTask } from "~/actions/application/task-actions";
import Task from "~/components/task/Task";
import { db } from "~/server/db";
import { comments } from "~/server/db/schema";

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

	

	return (
		<HydrationBoundary state={dehydrate(queryClient)}>
			<Task taskId={taskId} projectId={projectId} context={context} />
		</HydrationBoundary>
	);
}
