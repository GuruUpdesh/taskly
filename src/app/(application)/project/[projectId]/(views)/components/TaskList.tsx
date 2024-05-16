import React, { useMemo } from "react";

import {
	Draggable,
	type DraggableProvided,
	type DraggableStateSnapshot,
	Droppable,
	type DroppableProvided,
	type DroppableStateSnapshot,
} from "@hello-pangea/dnd";
import { DragHandleDots2Icon, PlusCircledIcon } from "@radix-ui/react-icons";
import { type UseMutationResult } from "@tanstack/react-query";
import { AnimatePresence, motion } from "framer-motion";
import { useShallow } from "zustand/react/shallow";

import { type UpdateTask } from "~/app/(application)/project/[projectId]/(views)/components/TasksContainer";
import CreateTask from "~/app/components/CreateTask";
import Task from "~/app/components/task/Task";
import { Button } from "~/components/ui/button";
import { type StatefulTask } from "~/config/taskConfigType";
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
	const [groupByBacklog, groupByBoard] = useAppStore(
		useShallow((state) => [state.groupByBacklog, state.groupByBoard]),
	);

	const groupBy = useMemo(() => {
		return variant === "backlog" ? groupByBacklog : groupByBoard;
	}, [variant, groupByBacklog, groupByBoard]);

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
						"bg-background/50":
							snapshot.isDraggingOver && listId !== "tasks",
						"flex h-full flex-col overflow-y-scroll p-1":
							variant === "board",
					})}
				>
					<AnimatePresence initial={false}>
						{taskOrder.map((taskId, idx) => {
							const task = tasks.find(
								(task) => task.id === taskId,
							);

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
										<motion.div
											initial={{ height: 0, opacity: 0 }}
											animate={{
												height: "auto",
												opacity: 1,
												transition: {
													type: "spring",
													bounce: 0.3,
													opacity: { delay: 0.1 },
													duration: 0.5,
												},
											}}
											exit={{
												height: 0,
												opacity: 0,
												transition: {
													duration: 0.5,
													type: "spring",
													bounce: 0.3,
												},
											}}
										>
											<div
												className={cn(
													"group relative backdrop-blur-xl transition-all",
													{
														"bg-accent-foreground/5":
															snapshot.isDragging,
														"pointer-events-none opacity-80":
															task.options
																.isPending,
														"animate-load_background bg-gradient-to-r from-green-500/25 to-transparent to-50% bg-[length:400%]":
															task.options
																.isNew &&
															!task.options
																.isPending,
														"mb-2":
															variant === "board",
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
													addTaskMutation={
														addTaskMutation
													}
													deleteTaskMutation={
														deleteTaskMutation
													}
													projectId={projectId}
													variant={variant}
													listId={listId}
												/>
											</div>
										</motion.div>
									)}
								</Draggable>
							) : null;
						})}
						{provided.placeholder}
					</AnimatePresence>
					{variant === "board" && (
						<CreateTask
							projectId={projectId}
							overrideDefaultValues={
								groupBy
									? {
											[groupBy]: listId,
										}
									: {}
							}
						>
							<Button
								variant="secondary"
								className="flex items-center justify-center border bg-accent/25 text-muted-foreground opacity-0 transition-opacity group-hover/list:opacity-100"
							>
								<PlusCircledIcon />
							</Button>
						</CreateTask>
					)}
				</div>
			)}
		</Droppable>
	);
};

export default TaskList;
