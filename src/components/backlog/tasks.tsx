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
import { useRegisterActions } from "kbar";
import { find } from "lodash";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import {
	deleteTask,
	getTasksFromProject,
	updateTask,
} from "~/actions/application/task-actions";
import Task from "~/components/backlog/task/task";
import Message from "~/components/general/message";
import { type TaskConfig } from "~/config/entityTypes";
import { getEnumOptionByKey, getPropertyConfig } from "~/config/TaskConfigType";
import { cn } from "~/lib/utils";
import type { Task as TaskType, User, Sprint } from "~/server/db/schema";
import { useAppStore } from "~/store/app";
import { filterTasks } from "~/utils/filter";
import { updateOrder } from "~/utils/order";

import { type TaskFormType } from "./create-task";
import { TaskStatus } from "../page/project/recent-tasks";

export type UpdateTask = {
	id: number;
	newTask: TaskFormType;
};

type Props = {
	projectId: string;
	assignees: User[];
	sprints: Sprint[];
};

type TaskTypeOverride = Omit<TaskType, "sprintId"> & {
	spintId: string;
};

export default function Tasks({ projectId, assignees, sprints }: Props) {
	/**
	 * Update the assignees and sprints in the store when they change
	 */
	const [updateAssignees, updateSprints, filters, groupBy] = useAppStore(
		(state) => [
			state.updateAssignees,
			state.updateSprints,
			state.filters,
			state.groupBy,
			state.hoveredTaskId,
		],
	);
	useEffect(() => {
		updateAssignees(assignees);
	}, [assignees]);
	useEffect(() => {
		updateSprints(sprints);
	}, [sprints]);

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
		queryKey: ["tasks"],
		queryFn: () => refetch(),
		staleTime: 6 * 1000,
		refetchInterval: 6 * 1000,
	});

	const addTaskMutation = useMutation({
		mutationFn: ({ id, newTask }: UpdateTask) => updateTask(id, newTask),
		onMutate: async ({ id, newTask }) => {
			console.log("onMutate > addTaskMutation");
			await queryClient.cancelQueries({ queryKey: ["tasks"] });
			const previousTasks = queryClient.getQueryData<TaskType[]>([
				"tasks",
			]);
			queryClient.setQueryData<TaskTypeOverride[]>(
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
			console.log("onMutate > deleteTaskMutation");
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
			console.log("onMutate > orderTasksMutation");
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
	}, [result.data]);

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
	const config = React.useMemo(() => {
		if (!groupBy) return null;
		return getPropertyConfig(
			groupBy as keyof TaskConfig,
			assignees,
			sprints,
		);
	}, [groupBy]);

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
			{["tasks"].map((group) => {
				const tasks = result.data;
				if (!tasks || config?.type === "text") return null;
				const option = getEnumOptionByKey(group);

				return (
					<Droppable droppableId={group} key={group}>
						{(provided: DroppableProvided) => (
							<div
								{...provided.droppableProps}
								ref={provided.innerRef}
							>
								{groupBy && option && (
									<div
										className={cn(
											"pointer-events-none flex items-center gap-1 p-1 px-4",
										)}
									>
										{option.icon}
										{option.displayName}
									</div>
								)}
								{taskOrder.map((taskId, idx) => {
									const task = tasks.find(
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
												// eslint-disable-next-line @typescript-eslint/no-unused-vars
												snapshot: DraggableStateSnapshot,
											) => (
												<div
													className={cn(
														"group relative bg-background/50 backdrop-blur-xl transition-colors",
														{
															"bg-accent-foreground/5":
																snapshot.isDragging,
															"pointer-events-none opacity-50":
																task.options
																	.isPending,
															"animate-load_background bg-gradient-to-r from-green-500/25 to-transparent to-50% bg-[length:400%]":
																task.options
																	.isNew &&
																!task.options
																	.isPending,
														},
													)}
													{...provided.draggableProps}
													{...provided.dragHandleProps}
													ref={provided.innerRef}
												>
													<DragHandleDots2Icon
														className={cn(
															"absolute bottom-[50%] left-1 translate-y-[50%] opacity-0 group-hover:opacity-50",
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
				);
			})}
		</DragDropContext>
	);
}
