"use client";

import React, { useEffect } from "react";

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
// import { useRegisterActions } from "kbar";
import { find } from "lodash";
// import { useRouter } from "next/navigation";
import { toast } from "sonner";

import {
	deleteTask,
	getTasksFromProject,
	updateTask,
} from "~/actions/application/task-actions";
import Task from "~/components/backlog/task/task";
import Message from "~/components/general/message";
import { cn } from "~/lib/utils";
import type { Task as TaskType } from "~/server/db/schema";
import { useAppStore } from "~/store/app";
import { filterTasks } from "~/utils/filter";
import { updateOrder } from "~/utils/order";

import { type TaskFormType } from "./create-task";

export type UpdateTask = {
	id: number;
	newTask: TaskFormType;
};

type Props = {
	projectId: string;
};

type TaskTypeOverride = Omit<TaskType, "sprintId"> & {
	spintId: string;
};

export default function Tasks({ projectId }: Props) {
	/**
	 * Get the assignees and sprints
	 */
	const [assignees, sprints, filters] = useAppStore((state) => [
		state.assignees,
		state.sprints,
		state.filters,
	]);

	/**
	 * Fetch the tasks from the server and handle optimistic updates
	 */
	const queryClient = useQueryClient();

	async function refetch() {
		const data = await getTasksFromProject(parseInt(projectId));

		let newTasks = data;
		if (newTasks) {
			const previousTasks = queryClient.getQueryData<TaskType[]>([
				"tasks",
				projectId,
			]);

			newTasks = newTasks.map((task) => {
				const isExistingTask = find(previousTasks, { id: task.id });
				return isExistingTask
					? task
					: { ...task, options: { ...task.options, isNew: true } };
			});
		}

		return newTasks;
	}

	const result = useQuery({
		queryKey: ["tasks", projectId],
		queryFn: () => refetch(),
		staleTime: 6 * 1000,
		refetchInterval: 6 * 1000,
	});

	const addTaskMutation = useMutation({
		mutationFn: ({ id, newTask }: UpdateTask) => updateTask(id, newTask),
		onMutate: async ({ id, newTask }) => {
			console.log("onMutate > addTaskMutation");
			await queryClient.cancelQueries({ queryKey: ["tasks", projectId] });
			const previousTasks = queryClient.getQueryData<TaskType[]>([
				"tasks",
			]);
			queryClient.setQueryData<TaskTypeOverride[]>(
				["tasks", projectId],
				(old) =>
					old?.map((task) =>
						task.id === id ? { ...task, ...newTask } : task,
					) ?? [],
			);
			return { previousTasks };
		},
		onError: (err, _, context) => {
			toast.error(err.message);
			queryClient.setQueryData(
				["tasks", projectId],
				context?.previousTasks,
			);
		},
		onSettled: () => queryClient.invalidateQueries({ queryKey: ["tasks"] }),
	});

	const deleteTaskMutation = useMutation({
		mutationFn: (id: number) => deleteTask(id),
		onMutate: async (id) => {
			console.log("onMutate > deleteTaskMutation");
			await queryClient.cancelQueries({ queryKey: ["tasks", projectId] });
			const previousTasks = queryClient.getQueryData<TaskType[]>([
				"tasks",
			]);
			queryClient.setQueryData<TaskType[]>(
				["tasks", projectId],
				(old) => old?.filter((task) => task.id !== id) ?? [],
			);
			return { previousTasks };
		},
		onError: (err, variables, context) => {
			toast.error(err.message);
			queryClient.setQueryData(
				["tasks", projectId],
				context?.previousTasks,
			);
		},
		onSettled: () =>
			queryClient.invalidateQueries({ queryKey: ["tasks", projectId] }),
	});

	const orderTasksMutation = useMutation({
		mutationFn: (taskOrder: Map<number, number>) => updateOrder(taskOrder),
		onMutate: async (taskOrder: Map<number, number>) => {
			console.log("onMutate > orderTasksMutation");
			await queryClient.cancelQueries({ queryKey: ["tasks", projectId] });

			const previousTasks = queryClient.getQueryData<TaskType[]>([
				"tasks",
				projectId,
			]);

			queryClient.setQueryData<TaskType[]>(
				["tasks", projectId],
				(oldTasks) => {
					const updatedTasks =
						oldTasks?.map((task) => {
							const newOrder = taskOrder.get(task.id);
							return newOrder !== undefined
								? { ...task, backlogOrder: newOrder }
								: task;
						}) ?? [];

					return updatedTasks;
				},
			);

			return { previousTasks };
		},
		onError: (err, variables, context) => {
			toast.error(err.message);
			queryClient.setQueryData(
				["tasks", projectId],
				context?.previousTasks,
			);
		},
		onSettled: () =>
			queryClient.invalidateQueries({ queryKey: ["tasks", projectId] }),
	});

	/**
	 * Handle Task Ordering and drag and drop
	 */
	const [taskOrder, setTaskOrder] = React.useState<number[]>([]);
	useEffect(() => {
		if (result.data) {
			const orderedIds = result.data
				.sort((a, b) => a.backlogOrder - b.backlogOrder)
				.map((task) => task.id);
			setTaskOrder(orderedIds);
		}
	}, [result.data, assignees, sprints]);

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

	/**
	 * Grouping tasks
	 */
	// const config = React.useMemo(() => {
	// 	if (!groupBy) return null;
	// 	return getPropertyConfig(
	// 		groupBy as keyof TaskConfig,
	// 		assignees,
	// 		sprints,
	// 	);
	// }, [groupBy]);

	if (!result.data) return <div>Loading...</div>;

	if (taskOrder.length === 0)
		return (
			<Message
				type="faint"
				description={
					<p className="py-2">Please create a task to get started.</p>
				}
			>
				This project doesn&apos;t have any tasks yet.
			</Message>
		);

	return (
		<DragDropContext onDragEnd={onDragEnd}>
			<Droppable droppableId="tasks">
				{(provided: DroppableProvided) => (
					<div {...provided.droppableProps} ref={provided.innerRef}>
						{taskOrder.map((taskId, idx) => {
							const task = result.data?.find(
								(task) => task.id === taskId,
							);

							if (!task || !filterTasks(task, filters)) {
								return null;
							}

							return task ? (
								<Draggable
									draggableId={String(task.id)}
									index={idx}
									key={task.id}
								>
									{(
										provided: DraggableProvided,
										snapshot: DraggableStateSnapshot,
									) => (
										<div
											className={cn(
												"group relative bg-background/50 backdrop-blur-xl transition-colors",
												{
													"bg-accent-foreground/5":
														snapshot.isDragging,
													"pointer-events-none opacity-50":
														task.options.isPending,
													"animate-load_background bg-gradient-to-r from-green-500/25 to-transparent to-50% bg-[length:400%]":
														task.options.isNew &&
														!task.options.isPending,
												},
											)}
											{...provided.draggableProps}
											{...provided.dragHandleProps}
											ref={provided.innerRef}
										>
											<DragHandleDots2Icon
												className={cn(
													"absolute bottom-[50%] left-0 translate-y-[50%] opacity-0 group-hover:opacity-50",
													snapshot.isDragging &&
														"opacity-100",
												)}
											/>
											<Task
												key={task.id}
												task={task}
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
