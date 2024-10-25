"use client";

import React from "react";

import { GitHubLogoIcon } from "@radix-ui/react-icons";
import type { UseMutationResult } from "@tanstack/react-query";
import {
	Copy,
	GitBranch,
	GitPullRequestArrow,
	Link,
	Trash,
	Trash2Icon,
} from "lucide-react";
import { toast } from "sonner";

import {
	ContextMenu,
	ContextMenuContent,
	ContextMenuItem,
	ContextMenuShortcut,
	ContextMenuSub,
	ContextMenuTrigger,
	ContextMenuSubContent,
	ContextMenuSubTrigger,
	ContextMenuSeparator,
} from "~/components/ui/context-menu";
import { taskConfig } from "~/config/taskConfigType";
import type { Task } from "~/server/db/schema";
import { useAppStore } from "~/store/app";

import TaskKBarUpdater from "./TaskKBarUpdater";

type Props = {
	task: Task;
	children: React.ReactNode;
	deleteTaskMutation?: UseMutationResult<void, Error, number, unknown>;
};
const TaskKBarUpdaterMemoized = React.memo(TaskKBarUpdater);

const TaskDropDownMenu = ({ task, children, deleteTaskMutation }: Props) => {
	const setHoveredTaskId = useAppStore((state) => state.setHoveredTaskId);

	const actions = [
		{
			id: "delete",
			name: "Delete",
			icon: <Trash2Icon className="h-4 w-4" />,
			shortcut: ["d"],
			perform: () => {
				if (!deleteTaskMutation) return;
				deleteTaskMutation.mutate(task.id);
				toast.error("Task deleted", {
					icon: <Trash className="h-4 w-4" />,
				});
			},
			section: `Actions - ${task.title}`,
		},
	];

	return (
		<ContextMenu>
			<TaskKBarUpdaterMemoized actions={actions} taskId={task.id} />
			<ContextMenuTrigger
				asChild
				onMouseEnter={() => setHoveredTaskId(task.id)}
			>
				{children}
			</ContextMenuTrigger>
			<ContextMenuContent>
				<ContextMenuSub>
					<ContextMenuSubTrigger className="gap-2">
						{taskConfig.status.icon}
						{task.status}
					</ContextMenuSubTrigger>
					<ContextMenuSubContent></ContextMenuSubContent>
				</ContextMenuSub>
				<ContextMenuSub>
					<ContextMenuSubTrigger className="gap-2">
						{taskConfig.points.icon}
						Points
					</ContextMenuSubTrigger>
					<ContextMenuSubContent></ContextMenuSubContent>
				</ContextMenuSub>
				<ContextMenuSub>
					<ContextMenuSubTrigger className="gap-2">
						{taskConfig.priority.icon}
						Priority
					</ContextMenuSubTrigger>
					<ContextMenuSubContent></ContextMenuSubContent>
					<ContextMenuSub>
						<ContextMenuSubTrigger className="gap-2">
							{taskConfig.type.icon}
							Type
						</ContextMenuSubTrigger>
						<ContextMenuSubContent></ContextMenuSubContent>
					</ContextMenuSub>
				</ContextMenuSub>
				<ContextMenuSeparator />
				<ContextMenuSub>
					<ContextMenuSubTrigger className="gap-2">
						<GitHubLogoIcon className="h-4 w-4" />
						Git
					</ContextMenuSubTrigger>
					<ContextMenuSubContent></ContextMenuSubContent>
				</ContextMenuSub>
				<ContextMenuSeparator />
				<ContextMenuItem key="github-redirect" className="gap-2">
					<Link className="h-4 w-4" />
					Copy Link
					<ContextMenuShortcut>{"p"}</ContextMenuShortcut>
				</ContextMenuItem>
				<ContextMenuItem key="duplicate" className="gap-2">
					<Copy className="h-4 w-4" />
					Duplicate
					<ContextMenuShortcut>{"d"}</ContextMenuShortcut>
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
					<ContextMenuShortcut>{"d"}</ContextMenuShortcut>
				</ContextMenuItem>
			</ContextMenuContent>
		</ContextMenu>
	);
};

export default React.memo(TaskDropDownMenu);
