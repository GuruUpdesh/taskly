import React, { useMemo } from "react";

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

import Task from "~/features/tasks/components/backlog/Task";
import { type UpdateTask } from "~/features/tasks/components/backlog/TasksContainer";
import { type StatefulTask } from "~/features/tasks/config/taskConfigType";
import { filterTasks } from "~/features/tasks/utils/filter";
import { cn } from "~/lib/utils";
import { useAppStore, type Filter } from "~/store/app";

type Props = {
	listId: string;
	taskOrder: number[];
	tasks: StatefulTask[] | undefined;
	filters: Filter[];
	addTaskMutation: UseMutationResult<void, Error, UpdateTask, unknown>;
	deleteTaskMutation: UseMutationResult<void, Error, number, unknown>;
	projectId: string;
};

const TaskList = ({
	listId,
	taskOrder,
	tasks,
	filters,
	addTaskMutation,
	deleteTaskMutation,
	projectId,
}: Props) => {
	const groupByBacklog = useAppStore((state) => state.groupByBacklog);

	const groupBy = useMemo(() => {
		return groupByBacklog;
	}, [groupByBacklog]);

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
						"bg-accent/50":
							snapshot.isDraggingOver && listId !== "tasks",
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
											"group relative backdrop-blur-xl transition-all",
											{
												"bg-accent-foreground/5":
													snapshot.isDragging,
												"pointer-events-none":
													task.options.isPending,
												"animate-load_background bg-gradient-to-r from-green-500/25 to-transparent to-50% bg-[length:400%]":
													task.options.isNew,
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
											listId={listId}
											comments={task.comments}
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
