"use client";

import React, { useState } from "react";

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


type Props = {
	task: Task;
	children: React.ReactNode;
	deleteTaskMutation: UseMutationResult<void, Error, number, unknown>;
};

const TaskDropDownMenu = ({ task, children, deleteTaskMutation }: Props) => {
	const actions = [
		{
			id: "delete",
			name: "Delete",
			icon: <Trash2Icon className="h-4 w-4" />,
			shortcut: ["d"],
			perform: () => {
				deleteTaskMutation.mutate(task.id);
				toast.warning("Task deleted");
			},
			priority: Priority.HIGH,
			section: "Task Actions",
		},
	];

	// todo move this to the backlog
	const [isHovered, setIsHovered] = useState(false);

	useRegisterActions(isHovered ? actions : [], [isHovered, actions]);

	return (
		<ContextMenu>
			<ContextMenuTrigger asChild onMouseEnter={() => setIsHovered(true)}>
				{children}
			</ContextMenuTrigger>
			<ContextMenuContent className="bg-accent/50 backdrop-blur-sm">
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

export default TaskDropDownMenu;
