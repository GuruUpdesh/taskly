"use client";

import {
	DragDropContext,
	Draggable,
	type DraggableProvided,
	type DropResult,
	Droppable,
	type DroppableProvided,
	type DraggableStateSnapshot,
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
import { updateOrder } from "~/utils/order";

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

	// to get seamless dnd to work, we need local state (outside of react-query)
	const [taskOrder, setTaskOrder] = React.useState<number[]>([]);
	useEffect(() => {
		if (result.data) {
			const orderedIds = result.data
				.sort((a, b) => a.backlogOrder - b.backlogOrder)
				.map((task) => task.id);
			setTaskOrder(orderedIds);
		}
	}, [result.data]);

	const addTaskMutation = useMutation({
		mutationFn: ({ id, newTask }: UpdateTask) => updateTask(id, newTask),
		onMutate: async ({ id, newTask }) => {
			await queryClient.cancelQueries({ queryKey: ["tasks"] });
			const previousTasks = queryClient.getQueryData<TaskType[]>([
				"tasks",
			]);
			queryClient.setQueryData<TaskType[]>(
				["tasks"],
				(old) =>
					old?.map((task) =>
						task.id === id ? { ...task, ...newTask } : task,
					) ?? [],
			);
			return { previousTasks };
		},
		onError: (err, _, context) => {
			toast.error(err.message);
			queryClient.setQueryData(["tasks"], context?.previousTasks);
		},
		onSettled: () => queryClient.invalidateQueries({ queryKey: ["tasks"] }),
	});

	const deleteTaskMutation = useMutation({
		mutationFn: (id: number) => deleteTask(id),
		onMutate: async (id) => {
			await queryClient.cancelQueries({ queryKey: ["tasks"] });
			const previousTasks = queryClient.getQueryData<TaskType[]>([
				"tasks",
			]);
			queryClient.setQueryData<TaskType[]>(
				["tasks"],
				(old) => old?.filter((task) => task.id !== id) ?? [],
			);
			return { previousTasks };
		},
		onError: (err, variables, context) => {
			toast.error(err.message);
			queryClient.setQueryData(["tasks"], context?.previousTasks);
		},
		onSettled: () => queryClient.invalidateQueries({ queryKey: ["tasks"] }),
	});

	const orderTasksMutation = useMutation({
		mutationFn: (taskOrder: Map<number, number>) => updateOrder(taskOrder),
		onMutate: async (taskOrder: Map<number, number>) => {
			await queryClient.cancelQueries({ queryKey: ["tasks"] });

			const previousTasks = queryClient.getQueryData<TaskType[]>([
				"tasks",
			]);

			queryClient.setQueryData<TaskType[]>(["tasks"], (oldTasks) => {
				const updatedTasks =
					oldTasks?.map((task) => {
						const newOrder = taskOrder.get(task.id);
						return newOrder !== undefined
							? { ...task, backlogOrder: newOrder }
							: task;
					}) ?? [];

				return updatedTasks;
			});

			return { previousTasks };
		},
		onError: (err, variables, context) => {
			toast.error(err.message);
			queryClient.setQueryData(["tasks"], context?.previousTasks);
		},
		onSettled: () => queryClient.invalidateQueries({ queryKey: ["tasks"] }),
	});

	if (!result.data) return <div>Loading...</div>;

	function onDragEnd(dragResult: DropResult) {
		const { source, destination } = dragResult;

		if (!destination || source.index === destination.index) {
			return;
		}

		const newTaskOrder = Array.from(taskOrder);
		const [reorderedId] = newTaskOrder.splice(source.index, 1);
		if (!reorderedId) return;
		newTaskOrder.splice(destination.index, 0, reorderedId);

		setTaskOrder(newTaskOrder);

		const taskOrderMap = new Map(
			newTaskOrder.map((id, index) => [id, index]),
		);
		orderTasksMutation.mutate(taskOrderMap);
	}

	return (
		<DragDropContext onDragEnd={onDragEnd}>
			<Droppable droppableId="tasks">
				{(provided: DroppableProvided) => (
					<div {...provided.droppableProps} ref={provided.innerRef}>
						{taskOrder.map((taskId, idx) => {
							const task = result.data?.find(
								(task) => task.id === taskId,
							);
							return task ? (
								<Draggable
									draggableId={String(task.id)}
									index={idx}
									key={task.id}
								>
									{(
										provided: DraggableProvided,
										// eslint-disable-next-line @typescript-eslint/no-unused-vars
										snapshot: DraggableStateSnapshot,
									) => (
										<div
											className="group relative bg-background/50 backdrop-blur-xl"
											{...provided.draggableProps}
											{...provided.dragHandleProps}
											ref={provided.innerRef}
										>
											<DragHandleDots2Icon className="absolute bottom-[50%] left-1 translate-y-[50%] opacity-0 group-hover:opacity-50" />
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
							) : null;
						})}
						{provided.placeholder}
					</div>
				)}
			</Droppable>
		</DragDropContext>
	);
}
