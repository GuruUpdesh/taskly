"use client";

import React, { useState } from "react";

import { GitHubLogoIcon } from "@radix-ui/react-icons";
import type { UseMutationResult } from "@tanstack/react-query";
import {
	ClipboardCopy,
	GitBranch,
	Link,
	SparkleIcon,
	Trash,
} from "lucide-react";
import { toast } from "sonner";
import { useShallow } from "zustand/react/shallow";

import { Button } from "~/components/ui/button";
import {
	ContextMenu,
	ContextMenuContent,
	ContextMenuItem,
	ContextMenuSub,
	ContextMenuTrigger,
	ContextMenuSubContent,
	ContextMenuSubTrigger,
	ContextMenuSeparator,
} from "~/components/ui/context-menu";
import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "~/components/ui/dialog";
import { aiAction } from "~/features/ai/actions/ai-action";
import { AIDAILYLIMIT, timeTillNextReset } from "~/features/ai/utils/aiLimit";
import {
	getPropertyConfig,
	taskProperties,
	taskVariants,
} from "~/features/tasks/config/taskConfigType";
import { cn } from "~/lib/utils";
import type { Sprint, Task, User } from "~/server/db/schema";
import { useAppStore } from "~/store/app";
import { useRealtimeStore } from "~/store/realtime";
import { useUserStore } from "~/store/user";
import { stringifyValue } from "~/utils/stringify-value";

import { type TaskFormType } from "../CreateTask";

type Props = {
	task: Task;
	children: React.ReactNode;
	deleteTaskMutation?: UseMutationResult<void, Error, number, unknown>;
	onSubmit: (newTask: TaskFormType) => void;
};

const TaskDropDownMenu = ({
	task,
	children,
	deleteTaskMutation,
	onSubmit,
}: Props) => {
	const setHoveredTaskId = useAppStore((state) => state.setHoveredTaskId);
	const aiUsageCount = useUserStore((state) => state.aiUsageCount);
	const [smartPropertiesDialog, setSmartPropertiesDialog] = useState(false);
	const [assignees, sprints] = useRealtimeStore(
		useShallow((state) => [state.assignees, state.sprints]),
	);

	return (
		<>
			<Dialog
				open={smartPropertiesDialog}
				onOpenChange={setSmartPropertiesDialog}
			>
				<DialogContent className="sm:max-w-md">
					<DialogHeader>
						<DialogTitle className="mb-4">
							This will override current properties!
						</DialogTitle>
						<DialogDescription>
							Smart properties can potentially change every
							property currently applied to this task. Are you
							sure you want to do this?
						</DialogDescription>
					</DialogHeader>
					<DialogFooter className="sm:justify-start">
						<DialogClose asChild>
							<Button
								type="submit"
								size="sm"
								// onClick={deleteProject}
								onClick={async () => {
									if (aiUsageCount >= AIDAILYLIMIT) {
										toast.error(
											`AI daily limit reached. Please try again in ${timeTillNextReset()} hours.`,
										);
										return;
									}

									const airesponse = await aiAction(
										task.title,
										task.description,
										assignees,
									);

									if (airesponse) {
										const userName = assignees.find(
											(user) =>
												user.username ===
												airesponse.assignee,
										)?.username;

										if (userName) {
											airesponse.assignee = userName;
										}

										void onSubmit({
											...task,
											sprintId: stringifyValue(
												task.sprintId,
											),
											...airesponse,
										});

										toast.success(
											"Applied smart properties",
											{
												icon: (
													<SparkleIcon className="h-4 w-4" />
												),
											},
										);
									}
								}}
								className="w-full"
							>
								Continue
							</Button>
						</DialogClose>
					</DialogFooter>
				</DialogContent>
			</Dialog>
			<ContextMenu>
				<ContextMenuTrigger
					asChild
					onMouseEnter={() => setHoveredTaskId(task.id)}
				>
					{children}
				</ContextMenuTrigger>
				<ContextMenuContent>
					<ContextMenuItem
						key="smart-properties"
						className="gap-2"
						onClick={() => {
							setSmartPropertiesDialog(true);
						}}
					>
						<SparkleIcon className="h-4 w-4" />
						Smart Properties
						{/* <ContextMenuShortcut>S</ContextMenuShortcut> */}
					</ContextMenuItem>
					<PropertiesMenu
						task={task}
						onSubmit={onSubmit}
						assignees={assignees}
						sprints={sprints}
					/>
					<ContextMenuSeparator />
					<ContextMenuItem
						key="copy-git-branch"
						className="gap-2"
						onClick={() => {
							if (!task.branchName) return;

							void navigator.clipboard.writeText(task.branchName);

							toast.info(`Copied branch name to clipboard`, {
								description: `Branch name: ${task.branchName}`,
								icon: <GitHubLogoIcon className="h-4 w-4" />,
							});
						}}
					>
						<GitBranch className="h-4 w-4" />
						Copy Branch Name
						{/* <ContextMenuShortcut>B</ContextMenuShortcut> */}
					</ContextMenuItem>
					<ContextMenuSeparator />
					<ContextMenuItem
						key="copy-link"
						className="gap-2"
						onClick={async () => {
							const protocol = window.location.protocol;
							await navigator.clipboard.writeText(
								protocol +
									"//" +
									window.location.host +
									`/project/${task.projectId}/task/${task.id}`,
							);
							toast.info("Task link copied to clipboard", {
								icon: <ClipboardCopy className="h-4 w-4" />,
							});
						}}
					>
						<Link className="h-4 w-4" />
						Copy Link
						{/* <ContextMenuShortcut>L</ContextMenuShortcut> */}
					</ContextMenuItem>
					<ContextMenuItem
						key="delete"
						onClick={() => {
							if (!deleteTaskMutation) return;
							deleteTaskMutation.mutate(task.id);
							toast.error("Task deleted", {
								icon: <Trash className="h-4 w-4" />,
							});
						}}
						className="gap-2"
					>
						<Trash className="h-4 w-4" />
						Delete
						{/* <ContextMenuShortcut>D</ContextMenuShortcut> */}
					</ContextMenuItem>
				</ContextMenuContent>
			</ContextMenu>
		</>
	);
};

type PropertiesMenuProps = {
	task: Task;
	onSubmit: (newTask: TaskFormType) => void;
	assignees: User[];
	sprints: Sprint[];
};

const PropertiesMenu = ({
	task,
	onSubmit,
	assignees,
	sprints,
}: PropertiesMenuProps) => {
	return (
		<>
			{taskProperties.map((property) => {
				const config = getPropertyConfig(property, assignees, sprints);
				if (config.type === "enum" || config.type === "dynamic")
					return (
						<ContextMenuSub>
							<ContextMenuSubTrigger className="gap-2">
								{config.icon}
								{config.displayName}
							</ContextMenuSubTrigger>
							<ContextMenuSubContent>
								{config.options.map((option) => (
									<ContextMenuItem
										key={stringifyValue(option.key)}
										className={cn(
											taskVariants({
												color: option.color,
												hover: true,
											}),
											"flex items-center space-x-2 whitespace-nowrap rounded-sm border py-1 pl-2 pr-3",
											"border-none bg-transparent !pl-2",
										)}
										onClick={() => {
											void onSubmit({
												...task,
												sprintId: stringifyValue(
													task.sprintId,
												),
												[config.key]:
													config.key === "sprintId"
														? String(option.key)
														: option.key,
											});
										}}
									>
										<div className="flex min-w-[8rem] items-center gap-2">
											<span>{option.icon}</span>
											<p>{option.displayName}</p>
										</div>
									</ContextMenuItem>
								))}
							</ContextMenuSubContent>
						</ContextMenuSub>
					);
			})}
		</>
	);
};

export default React.memo(TaskDropDownMenu);
