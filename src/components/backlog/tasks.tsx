"use client";

import React, { useEffect, useMemo } from "react";

import { DragDropContext, type DropResult } from "@hello-pangea/dnd";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
// import { useRegisterActions } from "kbar";
import { useRegisterActions } from "kbar";
import { find } from "lodash";
// import { useRouter } from "next/navigation";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useShallow } from "zustand/react/shallow";

import {
	type UpdateTaskData,
	deleteTask,
	getTasksFromProject,
	updateTask,
} from "~/actions/application/task-actions";
import Message from "~/components/general/message";
import LoadingTaskList from "~/components/page/backlog/loading-task-list";
import TaskList from "~/components/page/backlog/task-list";
import { TaskStatus } from "~/components/page/project/recent-tasks";
import {
	type StatefulTask,
	getPropertyConfig,
	taskVariants,
} from "~/config/TaskConfigType";
import { cn } from "~/lib/utils";
import type { Task as TaskType } from "~/server/db/schema";
import { useAppStore } from "~/store/app";
import { updateOrder } from "~/utils/order";

import TotalPoints from "./total-points";

export type UpdateTask = {
	id: number;
	newTask: UpdateTaskData;
};

type Props = {
	projectId: string;
	variant?: "backlog" | "board";
};

type TaskTypeOverride = Omit<TaskType, "sprintId"> & {
	spintId: string;
};

async function updateTaskWrapper({ id, newTask }: UpdateTask) {
	await updateTask(id, newTask);
}

export default function Tasks({ projectId, variant = "backlog" }: Props) {
	/**
	 * Get the assignees and sprints
	 */
	const [assignees, sprints, filters, groupByBacklog, groupByBoard] =
		useAppStore(
			useShallow((state) => [
				state.assignees,
				state.sprints,
				state.filters,
				state.groupByBacklog,
				state.groupByBoard,
			]),
		);

	const groupBy = useMemo(() => {
		return variant === "backlog" ? groupByBacklog : groupByBoard;
	}, [variant, groupByBacklog, groupByBoard]);

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

	/**
	 * Kbar
	 */
	const router = useRouter();
	useRegisterActions(
		result?.data?.map((task, idx) => ({
			id: String(task.id),
			name: task.title,
			icon: <TaskStatus status={task.status} />,
			shortcut: idx + 1 < 10 ? ["t", String(idx + 1)] : [],
			perform: () => router.push(`/project/${projectId}/task/${task.id}`),
			section: "Tasks",
		})) ?? [],
		[result.data],
	);

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
			<div
				className={cn({
					"grid max-w-full flex-1 gap-2 overflow-y-hidden overflow-x-scroll px-4":
						variant === "board",
				})}
				style={
					variant === "board"
						? {
								gridTemplateColumns: `repeat(${options?.length}, minmax(350px, 1fr))`,
							}
						: {}
				}
			>
				{groupBy && options ? (
					options.map((option) => (
						<div
							key={option.key}
							className={cn(
								{
									"overflow-y-scroll p-1 pt-0":
										variant === "board",
								},
								taskVariants({
									color: option.color,
									hover: false,
									context: "menu",
								}),
							)}
						>
							<div
								className={cn("w-full", {
									"flex items-center gap-2 px-4 py-2 pb-0":
										variant === "backlog",
									"sticky top-0 z-50 flex items-center gap-2 bg-background/75 px-1 py-2 pt-3 backdrop-blur-lg":
										variant === "board",
								})}
							>
								{option.icon}
								{option.displayName}
								<TotalPoints listId={option.key} />
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
									variant={variant}
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
						variant={variant}
					/>
				)}
			</div>
		</DragDropContext>
	);
}
