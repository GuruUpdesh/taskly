"use client";

import React from "react";

import type { Task } from "~/server/db/schema";
import { useRealtimeStore } from "~/store/realtime";

type Props = {
	task: Task;
};

const TaskState = ({ task }: Props) => {
	const updateTask = useRealtimeStore((state) => state.updateTask);

	React.useEffect(() => {
		updateTask(task);
	}, [task]);

	return null;
};

export default TaskState;
