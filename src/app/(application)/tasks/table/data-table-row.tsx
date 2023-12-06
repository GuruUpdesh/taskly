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

type DataTableRowProps = {
	task: Task;
  updateTask: (task: Task) => Promise<void>;
};

const DataTableRow = ({ task, updateTask }: DataTableRowProps) => {
	if (!task) return null;

  async function updateValue(key: keyof Task, value: string) {
    console.log("updateValue", key, value);
    const updatedTask = { ...task, [key]: value };
    await updateTask(updatedTask);
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

					if (!value) {
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
              updateValue={updateValue}
						/>
					);
				})}
		</TableRow>
	);
};

export default DataTableRow;
