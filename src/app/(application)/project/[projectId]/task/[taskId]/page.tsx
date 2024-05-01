import { eq } from "drizzle-orm";
import { type Metadata } from "next";

import { TaskWrapper } from "~/app/(application)/project/[projectId]/task/[taskId]/components/TaskWrapper";
import { db } from "~/server/db";
import { tasks } from "~/server/db/schema";

type Params = {
	params: {
		taskId: string;
		projectId: string;
	};
};

export async function generateMetadata({
	params: { taskId },
}: Params): Promise<Metadata> {
	const taskIdInteger = parseInt(taskId);
	if (isNaN(taskIdInteger)) {
		return {
			title: "Task",
		};
	}

	const taskResults = await db
		.select()
		.from(tasks)
		.where(eq(tasks.id, taskIdInteger));
	const task = taskResults[0];

	if (!task) {
		return {
			title: "Task",
		};
	}

	return {
		title: task.title,
	};
}

export default function TaskPage({ params: { taskId, projectId } }: Params) {
	return <TaskWrapper taskId={taskId} projectId={projectId} />;
}
