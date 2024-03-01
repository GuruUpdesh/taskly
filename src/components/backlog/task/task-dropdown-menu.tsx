"use client";

import React from "react";

import type { UseMutationResult } from "@tanstack/react-query";
import { Priority, useRegisterActions } from "kbar";
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

type Props = {
	task: Task;
	children: React.ReactNode;
	deleteTaskMutation?: UseMutationResult<void, Error, number, unknown>;
};

const TaskDropDownMenu = ({ task, children, deleteTaskMutation }: Props) => {
	const [hoveredTaskId, setHoveredTaskId] = useAppStore((state) => [
		state.hoveredTaskId,
		state.setHoveredTaskId,
	]);

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
			section: "Task Actions",
		},
	];

	useRegisterActions(hoveredTaskId === task.id ? actions : [], [
		hoveredTaskId,
		actions,
	]);

	return (
		<ContextMenu>
			<ContextMenuTrigger asChild>{children}</ContextMenuTrigger>
			<ContextMenuContent className="bg-accent/50 backdrop-blur-sm">
				{actions.map((action) => (
					<ContextMenuItem
						key={action.id}
						onClick={action.perform}
						className="gap-2"
						onMouseEnter={() => setHoveredTaskId(task.id)}
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

export default TaskDropDownMenu;
