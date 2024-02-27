import { TaskWrapper } from "~/components/task/TaskWrapper";

type Params = {
	params: {
		taskId: string;
		projectId: string;
	};
};

export default function TaskPage({ params: { taskId, projectId } }: Params) {
	return <TaskWrapper taskId={taskId} projectId={projectId} />;
}
