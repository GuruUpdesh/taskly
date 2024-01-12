"use client";

// hooks
import React, { useTransition, useOptimistic } from "react";

// data
import { type Task, type NewTask, insertTaskSchema } from "~/server/db/schema";

// ui
import {
	Table,
	TableBody,
	TableCaption,
	TableHead,
	TableHeader,
	TableRow,
} from "~/components/ui/table";
import {
	createTask,
	deleteTask,
	updateTask,
} from "~/app/(application)/tasks/_actions/task-actions";

// components
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
			{/* <AiDialog dispatch={dispatch} /> */}
			<Table className="border">
				<TableCaption>
					{!tasks ? "isPending..." : "A list of tasks"}
				</TableCaption>
				<TableHeader>
					<TableRow>
						<TableHead className="h-0 w-full p-0">
							{/* <p className="uppercase">Title</p> */}
						</TableHead>
						<TableHead className="h-0 p-0">
							{/* <p className="uppercase">Description</p> */}
						</TableHead>
						<TableHead className="h-0 p-0">
							{/* <p className="flex items-center uppercase">
								<Target className="mr-2 h-4 w-4" /> Status
							</p> */}
						</TableHead>
						<TableHead className="h-0 p-0">
							{/* <p className="flex items-center uppercase">
								<Flag className="mr-2 h-4 w-4" /> Priority
							</p> */}
						</TableHead>
						<TableHead className="h-0 p-0">
							{/* <p className="flex items-center uppercase">
								<Component className="mr-2 h-4 w-4" /> Type
							</p> */}
						</TableHead>
						<TableHead className="h-0 p-0"></TableHead>
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
