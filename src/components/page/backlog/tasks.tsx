"use client";

/**
 *  Uses the client to poll the server for tasks
 *  - Defines the query key for tasks
 * 	- Defines the mutations for updating and deleting tasks
 *  - Handle server errors and loading states
 *  - Renders the tasks
 */

// hooks
import React, { useEffect } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

// actions
import {
	deleteTask,
	getTasksFromProject,
	updateTask,
} from "~/actions/task-actions";

// types and schemas
import type { NewTask, User } from "~/server/db/schema";

// components
import Task from "~/components/task/task";

// utils
import { toast } from "sonner";

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

	// error and loading states
	useEffect(() => {
		if (result.error && result.error instanceof Error) {
			toast.error(result.error.message);
		}

		if (result.data && result.data.status === "error") {
			toast.error(result.data.error.message, {
				description: result.data.error.description,
			});
		}
	}, [result.error, result.data?.status]);

	if (!result.data || result.data.status === "error") {
		return (
			<div className="flex w-full items-center justify-center">
				{result.isLoading && <div>Loading...</div>}
				{result.error && <div>{result.error.message}</div>}
				{result.data && result.data.status === "error" && (
					<div>{result.data.error.message}</div>
				)}
			</div>
		);
	}

	const tasks = result.data.data;

	if (tasks.length === 0) {
		return (
			<div className="flex w-full items-center justify-center">
				Nothing has been created yet, to get started simply create a
				task.
			</div>
		);
	}

	return (
		<div>
			{tasks.map((task) => (
				<Task
					key={task.id}
					task={task}
					assignees={assignees}
					addTaskMutation={addTaskMutation}
					deleteTaskMutation={deleteTaskMutation}
					projectId={projectId}
				/>
			))}
		</div>
	);
}
