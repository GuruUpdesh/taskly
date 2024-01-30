"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import React, { useEffect } from "react";
import { toast } from "sonner";
import {
	deleteTask,
	getTasksFromProject,
	updateTask,
} from "~/actions/task-actions";
import Task from "~/components/backlog/task/task";
import type { NewTask, User } from "~/server/db/schema";

export type UpdateTask = {
	id: number;
	newTask: NewTask;
};

type Props = {
	projectId: string;
	assignees: User[];
};

export default function Tasks({ projectId, assignees }: Props) {
	const queryClient = useQueryClient();

	const result = useQuery({
		queryKey: ["tasks"],
		queryFn: () => getTasksFromProject(parseInt(projectId)),
		staleTime: 2 * 1000,
		refetchInterval: 6 * 1000,
	});

	const addTaskMutation = useMutation({
		mutationFn: ({ id, newTask }: UpdateTask) => updateTask(id, newTask),
		onSettled: () => queryClient.invalidateQueries({ queryKey: ["tasks"] }),
	});

	const deleteTaskMutation = useMutation({
		mutationFn: (id: number) => deleteTask(id),
		onSettled: () => queryClient.invalidateQueries({ queryKey: ["tasks"] }),
	});

	useEffect(() => {
		if (result.error && result.error instanceof Error) {
			toast.error(result.error.message);
		}
	}, [result.error]);

	if (!result.data) return <div>Loading...</div>;

	return (
		<div>
			{result.data.map((task) => (
				<Task
					key={task.id}
					task={task}
					assignees={assignees}
					addTaskMutation={addTaskMutation}
					deleteTaskMutation={deleteTaskMutation}
				/>
			))}
		</div>
	);
}
