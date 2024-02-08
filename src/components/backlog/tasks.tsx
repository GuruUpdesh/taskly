"use client";

import {
	DragDropContext,
	Draggable,
	DraggableProvided,
	DropResult,
	Droppable,
	DroppableProvided,
} from "@hello-pangea/dnd";
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

	function onDragEnd(dragResult: DropResult) {
		const { source, destination, draggableId } = dragResult;
		console.log(dragResult);
	}

	return (
		<DragDropContext onDragEnd={onDragEnd}>
			<Droppable droppableId="tasks">
				{(provided: DroppableProvided) => {
					if (!result.data) return <div>Loading...</div>;
					return (
						<div
							{...provided.droppableProps}
							ref={provided.innerRef}
						>
							{result.data
								.sort(
									(t1, t2) =>
										t1.backlogOrder - t2.backlogOrder,
								)
								.map((task, idx) => (
									<Draggable
										draggableId={String(task.id)}
										index={idx}
										key={task.id}
									>
										{(provided: DraggableProvided) => (
											<div
												{...provided.draggableProps}
												{...provided.dragHandleProps}
												ref={provided.innerRef}
											>
												<Task
													key={task.id}
													task={task}
													assignees={assignees}
													addTaskMutation={
														addTaskMutation
													}
													deleteTaskMutation={
														deleteTaskMutation
													}
													projectId={projectId}
												/>
											</div>
										)}
									</Draggable>
								))}
								{provided.placeholder}
						</div>
					);
				}}
			</Droppable>
		</DragDropContext>
	);
}
