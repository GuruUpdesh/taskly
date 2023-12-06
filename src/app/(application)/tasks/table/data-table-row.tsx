import React, { useEffect } from "react";

// ui
import {
	Table,
	TableBody,
	TableCaption,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "~/components/ui/table";
import DataCell from "./cells/data-cell-text";
import { z } from "zod";
import {
	NewTask,
	Task,
	insertTaskSchema,
	selectTaskSchema,
} from "~/server/db/schema";
import { Button } from "~/components/ui/button";
import { ChevronRight, Expand, SidebarCloseIcon, Trash, X } from "lucide-react";
import { OptimisticActions } from "./task-table";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { cn } from "~/lib/utils";

type DataTableRowProps = {
	variant: "new" | "data" | "ai";
	task: Task;
	optimisticActions: OptimisticActions;
	closeForm?: () => void;
};

const DataTableRow = ({
	variant,
	task,
	optimisticActions,
	closeForm,
}: DataTableRowProps) => {
	if (!task) return null;

	const defaultTaskValues = {
		title: task.title,
		description: task.description || "",
		status: task.status || "todo",
		priority: task.priority || "medium",
		type: task.type || "task",
	};

	const form = useForm<NewTask>({
		resolver: zodResolver(insertTaskSchema),
		defaultValues: defaultTaskValues,
	});

	useEffect(() => {
		console.log("task changed", task);
		form.reset(defaultTaskValues);
	}, [task]);

	async function updateDataValue(key: keyof Task, value: string) {
		const updatedTask = { ...task, [key]: value };
		await optimisticActions.updateTask(updatedTask);
	}

	async function onSubmit(newTask: NewTask) {
		console.log(newTask);
		if (variant === "data") {
			// get changes
			const changes = Object.keys(newTask).reduce((acc, key) => {
				if (newTask[key as keyof NewTask] !== task[key as keyof Task]) {
					return { ...acc, [key]: newTask[key as keyof NewTask] };
				}
				return acc;
			}, {});

			// if no changes return
			if (Object.keys(changes).length === 0) return;

			// update task
			await optimisticActions.updateTask({ ...task, ...changes });
		} else if (variant === "new") {
			await optimisticActions.createTask(newTask);
			form.reset();
			if (closeForm) {
				closeForm();
			}
		}
	}

	return (
		<TableRow className={cn({
			"pointer-events-none": variant === "ai",
		})}>
			{Object.keys(task)
				.filter((col) => col !== "id" && col !== "pending")
				.map((col) => {
					return (
						<DataCell
							key={col}
							col={col as keyof NewTask}
							form={form}
							onSubmit={onSubmit}
						/>
					);
				})}
			{variant === "data" ? (
				<TableCell className="flex justify-between p-0">
					<Button
						onClick={() => optimisticActions.deleteTask(task)}
						variant="ghost"
						size="icon"
					>
						<Trash className="h-4 w-4" />
					</Button>
					<Button variant="ghost" size="icon">
						<Expand className="h-4 w-4" />
					</Button>
				</TableCell>
			) : variant === "new" ? (
				<>
					<TableCell className="flex justify-between p-0">
						<Button
							onClick={() => {
								if (closeForm) closeForm();
							}}
							size="icon"
							variant="ghost"
						>
							<X className="h-4 w-4" />
						</Button>
						<Button
							onClick={() => form.handleSubmit(onSubmit)()}
							size="icon"
						>
							<ChevronRight className="h-4 w-4" />
						</Button>
					</TableCell>
				</>
			) : (
				<>
				</>
			)}
		</TableRow>
	);
};

export default DataTableRow;
