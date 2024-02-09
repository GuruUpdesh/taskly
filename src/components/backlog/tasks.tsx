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
			console.time("onMutate");
			await queryClient.cancelQueries({ queryKey: ["tasks"] });

			const previousTasks = queryClient.getQueryData<TaskType[]>([
				"tasks",
			]);

			queryClient.setQueryData<TaskType[]>(["tasks"], (oldTasks) => {
				console.time("queryClient.setQueryData");
				const updatedTasks =
					oldTasks?.map((task) => {
						const newOrder = taskOrder.get(task.id);
						return newOrder !== undefined
							? { ...task, backlogOrder: newOrder }
							: task;
					}) ?? [];

				console.timeEnd("queryClient.setQueryData");
				return updatedTasks;
			});

			console.timeEnd("onMutate");
			return { previousTasks };
		},
		onError: (err, variables, context) => {
			toast.error(err.message);
			queryClient.setQueryData(["tasks"], context?.previousTasks);
		},
		onSettled: () => queryClient.invalidateQueries({ queryKey: ["tasks"] }),
	});

	useEffect(() => {
		console.timeEnd("UE");
	}, [result.data, result.status]);

	if (!result.data) return <div>Loading...</div>;

	function onDragEnd(dragResult: DropResult) {
		console.time("UE");
		console.time("onDragEnd");
		const { source, destination } = dragResult;

		if (!destination || source.index === destination.index) {
			console.log("No change or invalid destination");
			return;
		}

		const currentTasks = result.data;

		if (!currentTasks) {
			console.log("No tasks available");
			return;
		}

		const newTasksOrder = Array.from(currentTasks);
		const [reorderedTask] = newTasksOrder.splice(source.index, 1);
		if (!reorderedTask) {
			console.log("No task found");
			return;
		}
		newTasksOrder.splice(destination.index, 0, reorderedTask);

		const taskOrderMap = new Map(
			newTasksOrder.map((task, index) => [task.id, index]),
		);

		orderTasksMutation.mutate(taskOrderMap);
	}

	return (
		<DragDropContext onDragEnd={onDragEnd}>
			<Droppable droppableId="tasks">
				{(provided: DroppableProvided) => (
					<div {...provided.droppableProps} ref={provided.innerRef}>
						{(result.data ? result.data : [])
							.sort((a, b) => a.backlogOrder - b.backlogOrder)
							.map((task, idx) => (
								<Draggable
									draggableId={String(task.id)}
									index={idx}
									key={task.id}
								>
									{(provided: DraggableProvided) => (
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
							))}
						{provided.placeholder}
					</div>
				)}
			</Droppable>
		</DragDropContext>
	);
}
