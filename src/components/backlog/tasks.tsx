"use client";

import React, { useEffect } from "react";

import { DragDropContext, type DropResult } from "@hello-pangea/dnd";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
// import { useRegisterActions } from "kbar";
import { find } from "lodash";
// import { useRouter } from "next/navigation";
import { toast } from "sonner";

import {
	type UpdateTaskData,
	deleteTask,
	getTasksFromProject,
	updateTask,
} from "~/actions/application/task-actions";
import Message from "~/components/general/message";
import {
	type StatefulTask,
	getPropertyConfig,
	taskVariants,
} from "~/config/TaskConfigType";
import { cn } from "~/lib/utils";
import type { Task as TaskType } from "~/server/db/schema";
import { useAppStore } from "~/store/app";
import { updateOrder } from "~/utils/order";

import LoadingTaskList from "../page/backlog/loading-task-list";
import TaskList from "../page/backlog/task-list";

export type UpdateTask = {
	id: number;
	newTask: UpdateTaskData;
};

type Props = {
	projectId: string;
};

type TaskTypeOverride = Omit<TaskType, "sprintId"> & {
	spintId: string;
};

async function updateTaskWrapper({ id, newTask }: UpdateTask) {
	console.time("updateTaskWrapper");
	await updateTask(id, newTask);
	console.timeEnd("updateTaskWrapper");
}

export default function Tasks({ projectId }: Props) {
	/**
	 * Get the assignees and sprints
	 */
	const [assignees, sprints, filters, groupBy] = useAppStore((state) => [
		state.assignees,
		state.sprints,
		state.filters,
		state.groupBy,
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

	const editTaskMutation = useMutation({
		mutationFn: ({ id, newTask }: UpdateTask) =>
			updateTaskWrapper({ id, newTask }),
		onMutate: async ({ id, newTask }) => {
			await queryClient.cancelQueries({ queryKey: ["tasks", projectId] });
			const previousTasks = queryClient.getQueryData<TaskType[]>([
				"tasks",
			]);
			queryClient.setQueryData<TaskTypeOverride[]>(
				["tasks", projectId],
				(old) =>
					old?.map((task) =>
						task.id === id
							? {
									...task,
									...newTask,
								}
							: task,
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
			console.timeEnd("order change");

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
		console.time("order change");
		const { source, destination } = dragResult;
		if (!destination || source.index === destination.index) {
			return;
		}

		const newTaskOrder = Array.from(taskOrder);
		const [reorderedId] = newTaskOrder.splice(source.index, 1);
		if (!reorderedId) return;

		if (source.droppableId !== destination.droppableId) {
			const task = result.data?.find((task) => task.id === reorderedId);
			if (!task || !groupBy) return;
			// to avoid popping we need to set the task to the new group here
			queryClient.setQueryData<StatefulTask[]>(
				["tasks", projectId],
				(old) =>
					old?.map((currentTask) =>
						currentTask.id === reorderedId
							? {
									...task,
									[groupBy]: destination.droppableId,
									backlogOrder: destination.index,
								}
							: currentTask,
					) ?? [],
			);
			editTaskMutation.mutate({
				id: task.id,
				newTask: {
					...task,
					sprintId: String(task.sprintId),
					[groupBy]: destination.droppableId,
					backlogOrder: destination.index,
				},
			});
		}

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
	const options = React.useMemo(() => {
		if (!groupBy) return null;
		const config = getPropertyConfig(groupBy, assignees, sprints);
		if (!config) return null;
		if (config.type !== "enum" && config.type !== "dynamic") return null;
		return config.options;
	}, [groupBy, assignees, sprints]);

	if (!result.data || (taskOrder.length === 0 && result.data.length !== 0))
		return <LoadingTaskList />;

	if (result.data.length === 0) {
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
	}

	return (
		<DragDropContext onDragEnd={onDragEnd}>
			{groupBy && options ? (
				options.map((option) => (
					<div
						key={option.key}
						className={cn(
							"",
							taskVariants({
								color: option.color,
								hover: false,
								context: "menu",
							}),
						)}
					>
						<div className="flex items-center gap-2 px-4 py-2 pb-0">
							{option.icon}
							{option.displayName}
						</div>
						<div className="pb-2">
							<TaskList
								listId={option.key}
								taskOrder={taskOrder}
								tasks={result.data}
								filters={filters}
								addTaskMutation={editTaskMutation}
								deleteTaskMutation={deleteTaskMutation}
								projectId={projectId}
							/>
						</div>
					</div>
				))
			) : (
				<TaskList
					listId="tasks"
					taskOrder={taskOrder}
					tasks={result.data}
					filters={filters}
					addTaskMutation={editTaskMutation}
					deleteTaskMutation={deleteTaskMutation}
					projectId={projectId}
				/>
			)}
		</DragDropContext>
	);
}
