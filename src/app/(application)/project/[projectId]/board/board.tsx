"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import React, { useEffect } from "react";
import { toast } from "sonner";
import {
	deleteTask,
	getTasksFromProject,
	updateTask,
} from "~/actions/task-actions";
import { optionVariants } from "~/components/backlog/task/property/propery-select";
import type { UpdateTask } from "~/components/backlog/tasks";
import BoardTask from "~/components/board/board-task";
import {
	type Status,
	getOptionForStatus,
	getStatusDisplayName,
	taskStatuses,
} from "~/entities/task-entity";
import { cn } from "~/lib/utils";
import type { Task as TaskType, User } from "~/server/db/schema";

type GroupedTasks = {
	[key in Status]?: TaskType[];
};

type Props = {
	projectId: string;
	assignees: User[];
};

export default function TaskBoard({ projectId, assignees }: Props) {
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

	const initialGroups: GroupedTasks = taskStatuses.reduce(
		(groups: GroupedTasks, status: Status) => {
			groups[status] = [];
			return groups;
		},
		{},
	);

	const groupedTasks: GroupedTasks = result.data.reduce(
		(groups: GroupedTasks, task: TaskType) => {
			(groups[task.status] = groups[task.status] ?? []).push(task);
			return groups;
		},
		initialGroups,
	);

	return (
		<div className="grid grid-cols-3 gap-4">
			{Object.keys(groupedTasks).map((status) => {
				const tasks = groupedTasks[status as Status];
				if (!tasks) return null;
				const option = getOptionForStatus(status as Status);
				if (!option) return null;
				return (
					<div
						key={status}
						className="rounded-lg border bg-accent/25 p-2"
					>
						<div
							className={cn(
								optionVariants({ color: option.color }),
								"justify-center border-none",
							)}
						>
							{option.icon}
							<h2>{getStatusDisplayName(status as Status)}</h2>
						</div>
						{tasks.map((task) => (
							<BoardTask
								key={task.id}
								task={task}
								assignees={assignees}
								addTaskMutation={addTaskMutation}
								deleteTaskMutation={deleteTaskMutation}
							/>
						))}
					</div>
				);
			})}
		</div>
	);
}
