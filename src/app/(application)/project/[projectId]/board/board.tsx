"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import React, { useEffect } from "react";
import { toast } from "sonner";
import {
	deleteTask,
	getTasksFromProject,
	updateTask,
} from "~/actions/application/task-actions";
import { optionVariants } from "~/components/backlog/task/property/propery-select";
import type { UpdateTask } from "~/components/backlog/tasks";
import BoardTask from "~/components/board/board-task";
import {
	type Status,
	getOptionForStatus,
	getStatusDisplayName,
	taskStatuses,
} from "~/config/task-entity";
import { cn } from "~/lib/utils";
import type {
	NewTask,
	Sprint,
	Task as TaskType,
	User,
} from "~/server/db/schema";
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
	sprints: Sprint[];
};

export default function TaskBoard({ projectId, assignees, sprints }: Props) {
	const queryClient = useQueryClient();
	const [tasks, setTasks] = React.useState<TaskType[]>([]);
	const result = useQuery({
		queryKey: ["tasks"],
		queryFn: () => getTasksFromProject(parseInt(projectId)),
		staleTime: 2 * 1000,
		refetchInterval: 6 * 1000,
	});

	useEffect(() => {
		if (result.data) {
			setTasks(result.data);
		}
	}, [result.data]);

	function optimisticUpdateTasks(id: number, newTask: NewTask) {
		const updatedTasks = tasks.map((task) => {
			if (task.id === id) {
				return { ...task, ...newTask };
			}
			return task;
		});
		setTasks(updatedTasks);
	}

	const addTaskMutation = useMutation({
		mutationFn: ({ id, newTask }: UpdateTask) => updateTask(id, newTask),
		onMutate: ({ id, newTask }: UpdateTask) =>
			optimisticUpdateTasks(id, newTask),
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

	const groupedTasks: GroupedTasks = tasks.reduce(
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
		if (
			!destination ||
			!task ||
			source.droppableId === destination.droppableId
		) {
			return;
		}
		const newStatus = destination.droppableId as Status;

		optimisticUpdateTasks(task.id, { ...task, status: newStatus });
		addTaskMutation.mutate({
			id: task.id,
			newTask: { ...task, status: newStatus },
		});
	}

	return (
		<DragDropContext onDragEnd={onDragEnd}>
			<div className="grid h-full grid-cols-3 gap-4">
				{Object.keys(groupedTasks).map((status) => {
					const tasks = groupedTasks[status as Status];
					if (!tasks) return null;
					const option = getOptionForStatus(status as Status);
					if (!option) return null;
					return (
						<div
							key={status}
							className="flex h-full flex-col rounded-lg border bg-accent/5 p-2"
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
																sprints={
																	sprints
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
