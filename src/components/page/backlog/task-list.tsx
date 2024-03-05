import React from "react";

import {
	Draggable,
	type DraggableProvided,
	type DraggableStateSnapshot,
	Droppable,
	type DroppableProvided,
	type DroppableStateSnapshot,
} from "@hello-pangea/dnd";
import { DragHandleDots2Icon } from "@radix-ui/react-icons";
import { type UseMutationResult } from "@tanstack/react-query";

import Task from "~/components/backlog/task/task";
import { type UpdateTask } from "~/components/backlog/tasks";
import { type StatefulTask } from "~/config/TaskConfigType";
import { cn } from "~/lib/utils";
import { useAppStore, type Filter } from "~/store/app";
import { filterTasks } from "~/utils/filter";

type Props = {
	listId: string;
	taskOrder: number[];
	tasks: StatefulTask[] | undefined;
	filters: Filter[];
	addTaskMutation: UseMutationResult<void, Error, UpdateTask, unknown>;
	deleteTaskMutation: UseMutationResult<void, Error, number, unknown>;
	projectId: string;
	variant?: "backlog" | "board";
};

const TaskList = ({
	listId,
	taskOrder,
	tasks,
	filters,
	addTaskMutation,
	deleteTaskMutation,
	projectId,
	variant = "backlog",
}: Props) => {
	const groupBy = useAppStore((state) => state.groupBy);

	if (!tasks) {
		return null;
	}

	return (
		<Droppable droppableId={listId}>
			{(
				provided: DroppableProvided,
				snapshot: DroppableStateSnapshot,
			) => (
				<div
					{...provided.droppableProps}
					ref={provided.innerRef}
					className={cn("min-h-2", {
						"bg-accent-foreground/5":
							snapshot.isDraggingOver && listId !== "tasks",
						"flex h-full flex-col gap-2 overflow-y-scroll p-1":
							variant === "board",
					})}
				>
					{taskOrder.map((taskId, idx) => {
						const task = tasks.find((task) => task.id === taskId);

						if (!task || !filterTasks(task, filters)) {
							return null;
						}

						if (listId !== "tasks" && groupBy) {
							let groupValue = task[groupBy];
							if (groupBy === "sprintId") {
								groupValue = String(groupValue);
							} else if (
								groupBy === "assignee" &&
								groupValue === null
							) {
								groupValue = "unassigned";
							}

							if (groupValue !== listId) {
								return null;
							}
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
												"absolute bottom-[50%] left-0 translate-y-[50%] text-foreground opacity-0 group-hover:opacity-50",
												snapshot.isDragging &&
													"opacity-100",
											)}
										/>
										<Task
											key={task.id}
											task={task}
											addTaskMutation={addTaskMutation}
											deleteTaskMutation={
												deleteTaskMutation
											}
											projectId={projectId}
											variant={variant}
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
};

export default TaskList;
