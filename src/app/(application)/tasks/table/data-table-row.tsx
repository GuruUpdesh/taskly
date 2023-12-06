import React from "react";

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
import { Task, selectTaskSchema } from "~/server/db/schema";
import { Button } from "~/components/ui/button";
import { Trash } from "lucide-react";
import { OptimisticActions } from "./task-table";

type DataTableRowProps = {
	variant?: "new" | "data";
	task: Task;
	optimisticActions: OptimisticActions;
};

const DataTableRow = ({
	task,
	optimisticActions,
	variant = "data",
}: DataTableRowProps) => {
	if (!task) return null;

	async function updateDataValue(key: keyof Task, value: string) {
		const updatedTask = { ...task, [key]: value };
		await optimisticActions.updateTask(updatedTask);
	}

	return (
		<TableRow>
			{Object.keys(task)
				.filter((col) => col !== "id" && col !== "pending")
				.map((col) => {
					const value = task[col as keyof Task];
					const valueValidator =
						selectTaskSchema.shape[col as keyof Task];

					const validator = z.object({
						value: valueValidator,
					});

					if (value === null) {
						return (
							<TableCell key={col} className="border p-0">
								null
							</TableCell>
						);
					}

					return (
						<DataCell
							key={col}
							col={col as keyof Task}
							value={value as string}
							validator={validator}
							updateValue={updateDataValue}
						/>
					);
				})}
			{variant === "data" ? (
				<TableCell className="border p-0">
					<Button
						onClick={() => optimisticActions.deleteTask(task)}
						variant="outline"
						size="icon"
					>
						<Trash className="h-4 w-4" />
					</Button>
				</TableCell>
			) : null}
		</TableRow>
	);
};

export default DataTableRow;
