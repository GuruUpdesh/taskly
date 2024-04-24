import { type Metadata } from "next";

import { getTask } from "~/actions/application/task-actions";
import { TaskWrapper } from "~/components/task/TaskWrapper";

type Params = {
	params: {
		taskId: string;
		projectId: string;
	};
};

export async function generateMetadata({
	params: { taskId },
}: Params): Promise<Metadata> {
	const task = await getTask(parseInt(taskId));
	if (!task || !task.success || !task.task) {
		return {
			title: "Task",
		};
	}

	return {
		title: task.task.title,
	};
}

export default function TaskPage({ params: { taskId, projectId } }: Params) {
	return <TaskWrapper taskId={taskId} projectId={projectId} />;
}
