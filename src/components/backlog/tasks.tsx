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
} from "~/actions/application/task-actions";
import Task from "~/components/backlog/task/task";
import { cn } from "~/lib/utils";
import type {
	NewTask,
	Task as TaskType,
	User,
	Sprint,
} from "~/server/db/schema";
import { updateOrder } from "~/utils/order";
import Message from "~/components/general/message";
import { find } from "lodash";
import { useAppStore } from "~/store/app";
import { useRegisterActions } from "kbar";
import { useRouter } from "next/navigation";
import { TaskStatus } from "../page/project/recent-tasks";
import { filterTasks } from "~/utils/filter";

export type UpdateTask = {
	id: number;
	newTask: NewTask;
};

type Props = {
	projectId: string;
	assignees: User[];
	sprints: Sprint[];
};

export default function Tasks({ projectId, assignees, sprints }: Props) {
	// update app assignees and sprints
	const [updateAssignees, updateSprints, filters] = useAppStore((state) => [
		state.updateAssignees,
		state.updateSprints,
		state.filters,
	]);

	useEffect(() => {
		updateAssignees(assignees);
	}, [assignees]);

	useEffect(() => {
		updateSprints(sprints);
	}, [sprints]);

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

	const addTaskMutation = useMutation({
		mutationFn: ({ id, newTask }: UpdateTask) => updateTask(id, newTask),
		onMutate: async ({ id, newTask }) => {
			console.log("onMutate > addTaskMutation");
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
													"absolute bottom-[50%] left-1 translate-y-[50%] opacity-0 group-hover:opacity-50",
													snapshot.isDragging &&
														"opacity-100",
												)}
											/>
											<Task
												key={task.id}
												task={task}
												assignees={assignees}
												sprints={sprints}
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
