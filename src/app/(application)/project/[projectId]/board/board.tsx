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
import {
	DragDropContext,
	Draggable,
	type DraggableProvided,
	type DropResult,
	Droppable,
	type DroppableProvided,
} from "@hello-pangea/dnd";

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

	function onDragEnd(dragResult: DropResult) {
		const { source, destination, draggableId } = dragResult;
		if (!result.data) return;
		const task = result.data.find(
			(task) => task.id === parseInt(draggableId),
		);
		console.log(task);
		console.log(dragResult);
		console.log(source);
		console.log(destination);
		if (
			!destination ||
			!task ||
			source.droppableId === destination.droppableId
		) {
			return;
		}
		const newStatus = destination.droppableId as Status;
		addTaskMutation.mutate({
			id: task.id,
			newTask: { ...task, status: newStatus },
		});
	}

	return (
		<DragDropContext onDragEnd={onDragEnd}>
			<div className="grid grid-cols-3 gap-4">
				{Object.keys(groupedTasks).map((status) => {
					const tasks = groupedTasks[status as Status];
					if (!tasks) return null;
					const option = getOptionForStatus(status as Status);
					if (!option) return null;
					return (
						<div
							key={status}
							className="flex flex-col rounded-lg border bg-accent/25 p-2"
						>
							<div
								className={cn(
									optionVariants({ color: option.color }),
									"justify-center border-none",
								)}
							>
								{option.icon}
								<h2>
									{getStatusDisplayName(status as Status)}
								</h2>
							</div>
							<Droppable droppableId={status}>
								{(provided: DroppableProvided) => (
									<div
										{...provided.droppableProps}
										ref={provided.innerRef}
										className="flex-1"
									>
										{tasks.map((task, index) => (
											<Draggable
												draggableId={String(task.id)}
												index={index}
												key={task.id}
											>
												{(
													provided: DraggableProvided,
												) => (
													<div
														{...provided.draggableProps}
														{...provided.dragHandleProps}
													>
														<div
															ref={
																provided.innerRef
															}
														>
															<BoardTask
																task={task}
																assignees={
																	assignees
																}
																addTaskMutation={
																	addTaskMutation
																}
																deleteTaskMutation={
																	deleteTaskMutation
																}
															/>
														</div>
													</div>
												)}
											</Draggable>
										))}
										{provided.placeholder}
									</div>
								)}
							</Droppable>
						</div>
					);
				})}
			</div>
		</DragDropContext>
	);
}
