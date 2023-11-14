"use client";

// hooks
import React, { useTransition, useOptimistic } from "react";
import { useForm } from "react-hook-form";

// data
import { type Task, type NewTask, insertTaskSchema } from "~/server/db/schema";

// utils
import { zodResolver } from "@hookform/resolvers/zod";
import { cn } from "~/lib/utils";
import { type VariantProps } from "class-variance-authority";

//ui
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
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "~/components/ui/dialog";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormMessage,
} from "~/components/ui/form";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { createTask, deleteTask } from "~/actions/taskActions";
import TaskChip, { type taskChipVariants } from "./TaskChip";
import { Textarea } from "~/components/ui/textarea";
import {
	ChevronRight,
	Flag,
	Target,
	Loader2,
	Component,
	Trash,
	Bot,
} from "lucide-react";
import { Checkbox } from "../ui/checkbox";
import { Label } from "~/components/ui/label";

type OptimisticTask = Task & { pending: boolean };

function reducer(
	state: OptimisticTask[],
	action: { type: "ADD" | "DELETE"; payload: Task },
) {
	switch (action.type) {
		case "ADD":
			return [...state, { ...action.payload, pending: true }];
		case "DELETE":
			return state.filter((task) => task.id !== action.payload.id);
		default:
			throw new Error("Invalid action type");
	}
}

type TaskTableProps = {
	tasks: Task[];
};

const TaskTable = ({ tasks }: TaskTableProps) => {
	const [isLoading, startTransition] = useTransition();
	const [optimisticTasks, dispatch] = useOptimistic(
		tasks.map((task) => ({ ...task, pending: false })),
		reducer,
	);

	function renderTaskRows() {
		return optimisticTasks.map((task) => (
			<TableRow
				key={task.id}
				className={cn({
					"pointer-events-none opacity-50": task.pending,
				})}
			>
				<TableCell className="min-w-[150px]">
					<p className="line-clamp-2 font-semibold tracking-tight">
						{task.title}
					</p>
				</TableCell>
				<TableCell>
					<p className="line-clamp-2 text-muted-foreground">
						{task.description}
					</p>
				</TableCell>
				<TableCell>
					{/* <TaskStatus status={task.status} /> */}
					<TaskChip chipType={getChipType("status", task.status)} />
				</TableCell>
				<TableCell>
					<TaskChip
						chipType={getChipType("priority", task.priority)}
					/>
				</TableCell>
				<TableCell>
					<TaskChip chipType={getChipType("type", task.type)} />
				</TableCell>
				<TableCell>
					<Button
						onClick={() =>
							startTransition(() => handleDelete(task))
						}
						variant="outline"
						size="icon"
					>
						<Trash className="h-4 w-4" />
					</Button>
				</TableCell>
			</TableRow>
		));
	}

	// options
	const [error, setError] = React.useState(false);

	// form hooks
	const form = useForm<NewTask>({
		resolver: zodResolver(insertTaskSchema),
		defaultValues: {
			title: "",
			description: "",
			status: "todo",
			priority: "medium",
			type: "task",
		},
	});

	async function onSubmit(data: NewTask) {
		try {
			dispatch({ type: "ADD", payload: { ...data, id: Math.random() } });
			if (error) {
				await new Promise((resolve) => setTimeout(resolve, 1000));
				throw new Error("Something went wrong");
			}
			await createTask(data);
			form.reset();
		} catch (error) {
			console.log(error);
		}
	}

	async function handleDelete(task: Task) {
		try {
			dispatch({ type: "DELETE", payload: task });
			if (error) {
				await new Promise((resolve) => setTimeout(resolve, 1000));
				throw new Error("Something went wrong");
			}
			await deleteTask(task.id);
		} catch (error) {
			console.log(error);
		}
	}

	return (
		<>
			<div className="flex items-center gap-2">
				<Form {...form}>
					<form
						onSubmit={form.handleSubmit((data: NewTask) =>
							startTransition(() => onSubmit(data)),
						)}
						className="flex flex-grow items-center gap-1 rounded-full bg-foreground/5 p-1"
					>
						<Input
							type="text"
							{...form.register("title")}
							placeholder="Title"
							className="rounded-l-full"
						/>
						<Input
							type="text"
							{...form.register("description")}
							placeholder="Description"
						/>

						{/* Status Select */}
						<FormField
							control={form.control}
							name="status"
							render={({ field }) => (
								<FormItem>
									<Select
										onValueChange={field.onChange}
										defaultValue={field.value as string}
									>
										<FormControl>
											<SelectTrigger>
												<SelectValue placeholder="Select status" />
											</SelectTrigger>
										</FormControl>
										<SelectContent>
											<SelectItem value="todo">
												To Do
											</SelectItem>
											<SelectItem value="inprogress">
												In Progress
											</SelectItem>
											<SelectItem value="done">
												Done
											</SelectItem>
										</SelectContent>
									</Select>
									<FormMessage />
								</FormItem>
							)}
						/>
						{/* Priority Select */}
						<FormField
							control={form.control}
							name="priority"
							render={({ field }) => (
								<FormItem>
									<Select
										onValueChange={field.onChange}
										defaultValue={field.value as string}
									>
										<FormControl>
											<SelectTrigger>
												<SelectValue placeholder="Select priority" />
											</SelectTrigger>
										</FormControl>
										<SelectContent>
											<SelectItem value="low">
												Low
											</SelectItem>
											<SelectItem value="medium">
												Medium
											</SelectItem>
											<SelectItem value="high">
												High
											</SelectItem>
										</SelectContent>
									</Select>
									<FormMessage />
								</FormItem>
							)}
						/>

						{/* Type Select */}
						<FormField
							control={form.control}
							name="type"
							render={({ field }) => (
								<FormItem>
									<Select
										onValueChange={field.onChange}
										defaultValue={field.value as string}
									>
										<FormControl>
											<SelectTrigger>
												<SelectValue placeholder="Select type" />
											</SelectTrigger>
										</FormControl>
										<SelectContent>
											<SelectItem value="task">
												Task
											</SelectItem>
											<SelectItem value="bug">
												Bug
											</SelectItem>
											<SelectItem value="feature">
												Feature
											</SelectItem>
										</SelectContent>
									</Select>
									<FormMessage />
								</FormItem>
							)}
						/>

						<Button
							type="submit"
							variant="outline"
							disabled={isLoading}
							className="rounded-r-full"
						>
							{isLoading ? "Submitting" : "Submit"}
							{isLoading ? (
								<Loader2 className="ml-2 h-4 w-4 animate-spin" />
							) : (
								<ChevronRight className="ml-2 h-4 w-4" />
							)}
						</Button>
					</form>
				</Form>
				<Dialog>
					<DialogTrigger>
						<Button
							variant="outline"
							size="icon"
							className="rounded-full"
						>
							<Bot className="h-6 w-6" />
						</Button>
					</DialogTrigger>
					<DialogContent>
						<DialogHeader>
							<DialogTitle>
								AI Task Creation
							</DialogTitle>
							<DialogDescription>
								Describe the task you would like to create, and our AI model will create it for you.
							</DialogDescription>
						</DialogHeader>
						<div>
							<form>
								<Label htmlFor="description">Task Description</Label>
								<Textarea id="description" placeholder="Type your task description here..."/>
								<Button className="mt-4">Submit</Button>
							</form>
						</div>
					</DialogContent>
				</Dialog>
			</div>
			<section className=" flex items-center justify-between">
				<p>Options:</p>
				<div className="flex items-center space-x-2">
					<Checkbox
						id="error"
						checked={error}
						onClick={() => setError(!error)}
						className="rounded"
					/>
					<label
						htmlFor="error"
						className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
					>
						Error durring optimistic update
					</label>
				</div>
			</section>

			<Table>
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
						<TableHead>
							<p className="uppercase">Action</p>
						</TableHead>
					</TableRow>
				</TableHeader>
				<TableBody>{renderTaskRows()}</TableBody>
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
