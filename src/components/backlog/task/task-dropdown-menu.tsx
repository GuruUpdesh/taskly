"use client";

import React from "react";

import type { UseMutationResult } from "@tanstack/react-query";
import { Priority } from "kbar";
import { Trash2Icon } from "lucide-react";
import { toast } from "sonner";

import {
	ContextMenu,
	ContextMenuContent,
	ContextMenuItem,
	ContextMenuShortcut,
	ContextMenuTrigger,
} from "~/components/ui/context-menu";
import type { Task } from "~/server/db/schema";
import { useAppStore } from "~/store/app";

import TaskKBarUpdater from "./task-kbar-updater";

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
				toast.warning("Task deleted");
			},
			priority: Priority.HIGH,
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
			<ContextMenuContent className="border-foreground/10 bg-background/75 backdrop-blur-xl">
				{actions.map((action) => (
					<ContextMenuItem
						key={action.id}
						onClick={action.perform}
						className="gap-2"
					>
						{action.icon}
						{action.name}
						<ContextMenuShortcut>
							{action.shortcut?.join(" + ")}
						</ContextMenuShortcut>
					</ContextMenuItem>
				))}
			</ContextMenuContent>
		</ContextMenu>
	);
};

export default React.memo(TaskDropDownMenu);
