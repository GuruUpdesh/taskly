import { useRegisterActions, type Action } from "kbar";

import { useAppStore } from "~/store/app";

type Props = {
	actions: Action[];
	taskId: number;
};

const TaskKBarUpdater = ({ actions, taskId }: Props) => {
	const hoveredTaskId = useAppStore((state) => state.hoveredTaskId);
	useRegisterActions(hoveredTaskId === taskId ? actions : [], [
		hoveredTaskId,
		actions,
	]);
	return null;
};

export default TaskKBarUpdater;
