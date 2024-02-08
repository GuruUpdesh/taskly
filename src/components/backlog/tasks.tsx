"use client";

import {
	DragDropContext,
	Draggable,
	type DraggableProvided,
	type DropResult,
	Droppable,
	type DroppableProvided,
} from "@hello-pangea/dnd";
import { DragHandleDots2Icon } from "@radix-ui/react-icons";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import React, { useEffect } from "react";
import { toast } from "sonner";
import {
	deleteTask,
	getTasksFromProject,
	updateTask,
} from "~/actions/task-actions";
import Task from "~/components/backlog/task/task";
import type { NewTask, Task as TaskType, User } from "~/server/db/schema";

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

	const [tasks, setTasks] = React.useState<TaskType[]>([]);

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
		if (result.data) {
			setTasks(
				result.data.sort((t1, t2) => t1.backlogOrder - t2.backlogOrder),
			);
		}

		console.log(addTaskMutation.variables);
	}, [
		result.status,
		result.data,
		addTaskMutation.variables,
		deleteTaskMutation.variables,
	]);

	useEffect(() => {
		if (result.error && result.error instanceof Error) {
			toast.error(result.error.message);
		}
	}, [result.error]);

	if (!result.data) return <div>Loading...</div>;

	function onDragEnd(dragResult: DropResult) {
		const { source, destination, draggableId } = dragResult;
		console.log(dragResult);
		if (source && destination && source.index !== destination.index) {
			const draggedTask = tasks.find(
				(task) => task.id === parseInt(draggableId),
			);
			console.log(draggedTask);
			if (!draggedTask) return;

			addTaskMutation.mutate({
				id: draggedTask.id,
				newTask: { ...draggedTask, backlogOrder: destination.index },
			});
		} else {
			console.log("no change");
		}
	}

	return (
		<DragDropContext onDragEnd={onDragEnd}>
			<Droppable droppableId="tasks">
				{(provided: DroppableProvided) => (
					<div {...provided.droppableProps} ref={provided.innerRef}>
						{tasks.map((task, idx) => (
							<Draggable
								draggableId={String(task.id)}
								index={idx}
								key={task.id}
							>
								{(provided: DraggableProvided) => (
									<div
										className="group relative backdrop-blur-lg"
										{...provided.draggableProps}
										{...provided.dragHandleProps}
										ref={provided.innerRef}
									>
										<DragHandleDots2Icon className="absolute bottom-[50%] left-1 translate-y-[50%] opacity-0 group-hover:opacity-50" />
										<Task
											key={task.id}
											task={task}
											assignees={assignees}
											addTaskMutation={addTaskMutation}
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
				)}
			</Droppable>
		</DragDropContext>
	);
}
