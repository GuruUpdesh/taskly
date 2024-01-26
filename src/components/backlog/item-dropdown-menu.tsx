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

const ItemDropDownMenu = ({ task, children, deleteTaskMutation }: Props) => {
	return (
		<ContextMenu>
			<ContextMenuTrigger className="flex items-center justify-between border-b py-2">
				{children}
			</ContextMenuTrigger>
			<ContextMenuContent className="bg-accent/50 backdrop-blur-sm">
				<ContextMenuItem onClick={() => {
					deleteTaskMutation.mutate(task.id)
					toast.warning("Task deleted");
				}
				}>
					<Trash2Icon className="w-4 h-4 mr-2" />
					Delete
				</ContextMenuItem>
			</ContextMenuContent>
		</ContextMenu>
	);
};

export default ItemDropDownMenu;
