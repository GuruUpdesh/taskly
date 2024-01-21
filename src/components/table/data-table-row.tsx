// hooks
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";

// ui
import { TableCell, TableRow } from "~/components/ui/table";
import DataCell from "./cells/data-cell-text";
import { type NewTask, type Task } from "~/server/db/schema";
import { Button } from "~/components/ui/button";
import { ChevronRight, Expand, Trash, X } from "lucide-react";

// types
import { type OptimisticActions } from "./task-table";

// utils
import { zodResolver } from "@hookform/resolvers/zod";
import { cn } from "~/lib/utils";
import { getTaskConfig, taskSchema } from "~/entities/task-entity";

// components
import DataCellSelect from "./cells/data-cell-select";

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
	const defaultTaskValues = {
		title: task.title,
		description: task.description ?? "",
		projectId: task.projectId ?? "",
		status: task.status ?? "todo",
		priority: task.priority ?? "medium",
		type: task.type ?? "task",
	};

	const form = useForm<NewTask>({
		resolver: zodResolver(taskSchema),
		defaultValues: defaultTaskValues,
	});

	useEffect(() => {
		console.log("task changed", task);
		form.reset(defaultTaskValues);
	}, [task]);

	async function onSubmit(newTask: NewTask) {
		newTask.projectId = task.projectId;
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
		<TableRow
			className={cn(" bg-background", {
				"pointer-events-none": variant === "ai",
			})}
		>
			{Object.keys(task)
				.filter((col) => col !== "id" && col !== "pending")
				.map((col, idx) => {
					if (col !== "projectId") {
						const config = getTaskConfig(col);

						if (config.type === "text")
							return (
								<DataCell
									key={col}
									config={config}
									col={col as keyof NewTask}
									form={form}
									onSubmit={onSubmit}
									autoFocus={idx === 0 && variant === "new"}
								/>
							);
						if (config.type === "select")
							return (
								<DataCellSelect
									key={col}
									config={config}
									col={col as keyof NewTask}
									form={form}
									onSubmit={onSubmit}
									isNew={variant === "new"}
								/>
							);
					}
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
					<TableCell className="p-0 ">
						<Button
							onClick={() => {
								if (closeForm) closeForm();
							}}
							size="icon"
							variant="ghost"
						>
							<X className="h-4 w-4" />
						</Button>
					</TableCell>
					<TableCell className="w-50 p-0">
						<Button onClick={() => form.handleSubmit(onSubmit)()}>
							Add
							<ChevronRight className="h-4 w-4" />
						</Button>
					</TableCell>
				</>
			) : (
				<></>
			)}
		</TableRow>
	);
};

export default DataTableRow;
