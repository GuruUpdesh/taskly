"use client";

import React, { useEffect, useMemo } from "react";

import { DragDropContext, type DropResult } from "@hello-pangea/dnd";
import { PlusCircledIcon } from "@radix-ui/react-icons";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRegisterActions } from "kbar";
import { find } from "lodash";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useShallow } from "zustand/react/shallow";

import {
	type UpdateTaskData,
	deleteTask,
	getTasksFromProject,
	updateTask,
} from "~/actions/application/task-actions";
import CreateTask from "~/app/components/CreateTask";
import Message from "~/app/components/Message";
import { TaskStatus } from "~/app/components/RecentTasks";
import { Button } from "~/components/ui/button";
import { getRefetchIntervals } from "~/config/refetchIntervals";
import {
	type StatefulTask,
	getPropertyConfig,
	taskVariants,
} from "~/config/taskConfigType";
import { cn } from "~/lib/utils";
import type { Task as TaskType } from "~/server/db/schema";
import { useAppStore } from "~/store/app";
import { useRealtimeStore } from "~/store/realtime";
import { updateOrder } from "~/utils/order";

import LoadingTaskList from "./LoadingTaskList";
import TaskList from "./TaskList";
import TotalTaskListPoints from "./TotalTaskListPoints";

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
	await updateTask(id, newTask);
}

export default function TasksContainer({ projectId }: Props) {
	/**
	 * Get the assignees and sprints
	 */
	const [filters, groupByBacklog, groupByBoard, viewMode] = useAppStore(
		useShallow((state) => [
			state.filters,
			state.groupByBacklog,
			state.groupByBoard,
			state.viewMode,
		]),
	);

	const [assignees, sprints] = useRealtimeStore(
		useShallow((state) => [state.assignees, state.sprints]),
	);

	const groupBy = useMemo(() => {
		return viewMode === "backlog" ? groupByBacklog : groupByBoard;
	}, [viewMode, groupByBacklog, groupByBoard]);

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
		refetchInterval: getRefetchIntervals().tasks,
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
		if (
			!destination ||
			(source.index === destination.index &&
				source.droppableId === destination.droppableId)
		) {
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
			let transformedValue: string = destination.droppableId;
			if (groupBy === "assignee" && destination.droppableId === null) {
				transformedValue = "unassigned";
			}

			editTaskMutation.mutate({
				id: task.id,
				newTask: {
					[groupBy]: transformedValue,
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
				className="min-w-[600px]"
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
						viewMode === "board",
				})}
				style={
					viewMode === "board"
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
									"group/list overflow-y-scroll p-1 pt-0":
										viewMode === "board",
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
										viewMode === "backlog",
									"sticky top-0 z-10 flex items-center gap-2 px-1 py-2 pt-3":
										viewMode === "board",
								})}
							>
								{option.icon}
								{option.displayName}
								<div className="flex-grow" />
								<TotalTaskListPoints listId={option.key} />
								<CreateTask
									projectId={projectId}
									overrideDefaultValues={{
										[groupBy]: option.key,
									}}
								>
									<Button
										size="icon"
										variant="ghost"
										className="text-muted-foreground"
									>
										<PlusCircledIcon />
									</Button>
								</CreateTask>
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
									variant={viewMode}
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
						variant={viewMode}
					/>
				)}
			</div>
		</DragDropContext>
	);
}
