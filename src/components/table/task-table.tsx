"use client";

// hooks
import React, { useTransition, useOptimistic } from "react";

// data
import {
	type Task,
	type NewTask,
	insertTaskSchema__required,
} from "~/server/db/schema";

// ui
import { Table, TableBody, TableCaption } from "~/components/ui/table";
import { createTask, deleteTask, updateTask } from "~/actions/task-actions";

// components
import NewRow from "./new-row";
import DataTableRow from "./data-table-row";
import { useProjectStore } from "~/store/project";

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
	projectId: number;
};

export type OptimisticActions = {
	createTask: (task: NewTask) => Promise<void>;
	deleteTask: (task: Task) => Promise<void>;
	updateTask: (task: Task) => Promise<void>;
};

const TaskTable = ({ tasks, projectId }: TaskTableProps) => {
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	const [_, startTransition] = useTransition();
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
				const data: NewTask = {
					title: task.title,
					description: task.description,
					status: task.status,
					priority: task.priority,
					type: task.type,
					projectId: projectId,
				};
				const validated = insertTaskSchema__required.safeParse(data);
				if (!validated.success) {
					return;
				}
				const validatedTask = validated.data;

				await updateTask(task.id, validatedTask as NewTask);
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
			<Table className="border">
				<TableCaption>
					{!tasks ? "isPending..." : "A list of tasks"}
				</TableCaption>
				<TableBody>
					{renderTaskRows()}
					<NewRow
						optimisticActions={optimisticActions}
						projectId={projectId}
					/>
				</TableBody>
			</Table>
		</>
	);
};

export default TaskTable;
