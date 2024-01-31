"use client";

import React from "react";
import {
	ContextMenu,
	ContextMenuContent,
	ContextMenuItem,
	ContextMenuTrigger,
} from "~/components/ui/context-menu";
import { Trash2Icon } from "lucide-react";
import type { UseMutationResult } from "@tanstack/react-query";
import type { Task } from "~/server/db/schema";
import { toast } from "sonner";

type Props = {
	task: Task;
	children: React.ReactNode;
	deleteTaskMutation: UseMutationResult<void, Error, number, unknown>;
};

const TaskDropDownMenu = ({ task, children, deleteTaskMutation }: Props) => {
	return (
		<ContextMenu>
			<ContextMenuTrigger>{children}</ContextMenuTrigger>
			<ContextMenuContent className="bg-accent/50 backdrop-blur-sm">
				<ContextMenuItem
					onClick={() => {
						deleteTaskMutation.mutate(task.id);
						toast.warning("Task deleted");
					}}
				>
					<Trash2Icon className="mr-2 h-4 w-4" />
					Delete
				</ContextMenuItem>
			</ContextMenuContent>
		</ContextMenu>
	);
};

export default TaskDropDownMenu;
