"use client";

// hooks
import React, { useTransition, useOptimistic } from "react";
import { useForm } from "react-hook-form";

// data
import {
	type Task,
	type NewTask,
	insertTaskSchema,
	task,
} from "~/server/db/schema";

// utils
import { zodResolver } from "@hookform/resolvers/zod";
import { cn } from "~/lib/utils";
import { type VariantProps } from "class-variance-authority";

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
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "~/components/ui/select";

import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormMessage,
} from "~/components/ui/form";
import { Input } from "../../../../components/ui/input";
import { Button } from "../../../../components/ui/button";
import {
	createTask,
	deleteTask,
	updateTask,
} from "~/app/(application)/tasks/_actions/task-actions";
import TaskChip, { type taskChipVariants } from "../task-chip";

import {
	ChevronRight,
	Flag,
	Target,
	Loader2,
	Component,
	Trash,
} from "lucide-react";
import { Checkbox } from "../../../../components/ui/checkbox";
import AiDialog from "../ai-dialog";
import NewRow from "./new-row";
import DataTableRow from "./data-table-row";

type OptimisticTask = Task & { pending?: boolean };

function reducer(
	state: OptimisticTask[],
	action: { type: "ADD" | "DELETE" | "UPDATE"; payload: Task },
) {
	switch (action.type) {
		case "ADD":
			return [...state, { ...action.payload, pending: true }];
		case "DELETE":
			return state.filter((task) => task.id !== action.payload.id);
		case "UPDATE":
			const newState = state.map((task) =>
				task.id === action.payload.id
					? { ...task, ...action.payload, pending: true }
					: task,
			);
			return newState;
		default:
			throw new Error("Invalid action type");
	}
}

type TaskTableProps = {
	tasks: Task[];
};

export type OptimisticActions = {
	createTask: (task: NewTask) => Promise<void>;
	deleteTask: (task: Task) => Promise<void>;
	updateTask: (task: Task) => Promise<void>;
};

const TaskTable = ({ tasks }: TaskTableProps) => {
	const [isLoading, startTransition] = useTransition();
	const [optimisticTasks, dispatch] = useOptimistic(
		tasks.map((task) => ({ ...task, pending: false })),
		reducer,
	);

	const optimisticActions: OptimisticActions = {
		createTask: async (task: NewTask) => {
			try {
				dispatch({
					type: "ADD",
					payload: { ...task, id: Math.random() },
				});
				// if (error) {
				// 	await new Promise((resolve) => setTimeout(resolve, 1000));
				// 	throw new Error("Something went wrong");
				// }
				await createTask(task);
			} catch (error) {
				console.log(error);
			}
		},
		deleteTask: async (task: Task) => {
			try {
				startTransition(() =>
					dispatch({ type: "DELETE", payload: task }),
				);
				// if (error) {
				// 	await new Promise((resolve) => setTimeout(resolve, 1000));
				// 	throw new Error("Something went wrong");
				// }
				await deleteTask(task.id);
			} catch (error) {
				console.log(error);
			}
		},
		updateTask: async (task: Task) => {
			try {
				startTransition(() =>
					dispatch({ type: "UPDATE", payload: task }),
				);
				const data = {
					title: task.title,
					description: task.description,
					status: task.status,
					priority: task.priority,
					type: task.type,
				};
				const validated = insertTaskSchema.safeParse(data);
				if (!validated.success) {
					return;
				}
				await updateTask(task.id, validated.data);
			} catch (error) {
				console.log(error);
			}
		},
	};

	function renderTaskRows() {
		return optimisticTasks.map((task) => {
			return (
				<DataTableRow
					key={task.id}
					variant="data"
					task={task as Task}
					optimisticActions={optimisticActions}
				/>
			);
		});
	}

	return (
		<>
			<div className="flex items-center gap-2">
				<AiDialog dispatch={dispatch} />
			</div>
			<Table className="border">
				<TableCaption>
					{!tasks ? "isPending..." : "A list of tasks"}
				</TableCaption>
				<TableHeader>
					<TableRow>
						<TableHead>
							<p className="uppercase">Title</p>
						</TableHead>
						<TableHead>
							<p className="uppercase">Description</p>
						</TableHead>
						<TableHead>
							<p className="flex items-center uppercase">
								<Target className="mr-2 h-4 w-4" /> Status
							</p>
						</TableHead>
						<TableHead>
							<p className="flex items-center uppercase">
								<Flag className="mr-2 h-4 w-4" /> Priority
							</p>
						</TableHead>
						<TableHead>
							<p className="flex items-center uppercase">
								<Component className="mr-2 h-4 w-4" /> Type
							</p>
						</TableHead>
						<TableHead className="p-0">
							{/* <p className="uppercase">Action</p> */}
						</TableHead>
					</TableRow>
				</TableHeader>
				<TableBody>
					{renderTaskRows()}
					<NewRow optimisticActions={optimisticActions} />
				</TableBody>
			</Table>
		</>
	);
};

export default TaskTable;

function getChipType(
	type: string,
	field: string | null,
): VariantProps<typeof taskChipVariants>["chipType"] {
	if (!field) return "null";
	// @ts-expect-error we know this is a valid type and field
	// todo refactor this
	return `${type}_${field}`;
}
