"use client";

import React from "react";

import type { Task } from "~/server/db/schema";
import { useNavigationStore } from "~/store/navigation";

type Props = {
	task: Task;
};

const TaskState = ({ task }: Props) => {
	const updateTask = useNavigationStore((state) => state.updateTask);

	React.useEffect(() => {
		updateTask(task);
	}, [task]);

	return null;
};

export default TaskState;
