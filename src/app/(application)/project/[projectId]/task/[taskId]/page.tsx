import { type Metadata } from "next";

import { getAllTasks, getTask } from "~/actions/application/task-actions";
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
};

export async function generateStaticParams() {
	const tasks = await getAllTasks();
	if (!tasks) {
		return []
	};

	return tasks.map((task) => ({
		params: {
			taskId: task.id.toString(),
			projectId: task.projectId.toString(),
		},
	}));
}

export default function TaskPage({ params: { taskId, projectId } }: Params) {
	return <TaskWrapper taskId={taskId} projectId={projectId} />;
};
