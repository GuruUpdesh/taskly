"use client";

import { Bot, Plus } from "lucide-react";
import React, { useState, useEffect } from "react";
import { Button } from "~/components/ui/button";

// ui
import { TableCell, TableRow } from "~/components/ui/table";
import { type NewTask } from "~/server/db/schema";
import DataTableRow from "./data-table-row";
import type { OptimisticActions } from "./task-table";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "~/components/ui/popover";
import NewAiTask from "./new-ai-task";

type NewRowProps = {
	optimisticActions: OptimisticActions;
};

const NewRow = ({ optimisticActions }: NewRowProps) => {
	const [showForm, setShowForm] = useState(false);
	const [showAiForm, setShowAiForm] = useState(false);

	function handleClick(
		event: React.MouseEvent<HTMLButtonElement, MouseEvent>,
	) {
		if (event.ctrlKey) {
			setShowAiForm(true);
		} else {
			setShowForm(true);
		}
	}

	const [popoverOpen, setPopoverOpen] = useState(false);
	useEffect(() => {
		if (!popoverOpen) {
			setShowForm(false);
			setShowAiForm(false);
		}
	}, [popoverOpen]);

	const defaultValues: NewTask = {
		title: "",
		description: "",
		status: "todo",
		priority: "medium",
		type: "task",
	};

	function renderPopoverContent() {
		if (showForm) {
			return (
				<DataTableRow
					variant="new"
					task={{ ...defaultValues, id: Math.random() }}
					optimisticActions={optimisticActions}
					closeForm={() => {
						setShowForm(false);
						setPopoverOpen(false);
					}}
				/>
			);
		}
		if (showAiForm) {
			return (
				<NewAiTask
					optimisticActions={optimisticActions}
					closeForm={() => {
						setShowAiForm(false);
						setPopoverOpen(false);
					}}
				/>
			);
		}
	}

	return (
		<TableRow>
			<TableCell className="relative p-0" colSpan={6}>
				<Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
					<PopoverTrigger asChild>
						<Button
							variant="ghost"
							className="flex w-full justify-start opacity-50 "
							onClick={handleClick}
						>
							<Plus className="mr-2 h-4 w-4" /> New
							<span className=" ml-4 flex items-center gap-1 bg-muted p-1 px-4">
								<Bot className="h-4 w-4" />
								Hold Ctrl for AI
							</span>
						</Button>
					</PopoverTrigger>
					<PopoverContent
						side={showAiForm ? "bottom" : "top"}
						align="start"
						className="w-full bg-blue-500/50 p-[1px] backdrop-blur-lg"
					>
						{renderPopoverContent()}
					</PopoverContent>
				</Popover>
			</TableCell>
		</TableRow>
	);
};

export default NewRow;
