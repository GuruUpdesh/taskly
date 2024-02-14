"use client";

import React, { useMemo, useState } from "react";
import {
	buildDynamicOptions,
	defaultValues,
	getTaskConfig,
} from "~/config/task-entity";
import { useNavigationStore } from "~/store/navigation";
import { type UseFormReturn, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
	type NewTask,
	type User,
	insertTaskSchema__required,
	type Sprint,
	type Task,
} from "~/server/db/schema";
import { createTask } from "~/actions/task-actions";
import { toast } from "sonner";
import { Input } from "~/components/ui/input";
import { Textarea } from "~/components/ui/textarea";
import PropertySelect from "./task/property/propery-select";
import { cn } from "~/lib/utils";
import { motion } from "framer-motion";
import { Button } from "~/components/ui/button";
import {
	Dialog,
	DialogHeader,
	DialogTrigger,
	DialogContent,
	DialogTitle,
	DialogFooter,
} from "~/components/ui/dialog";
import { ChevronRight, Loader2, SparkleIcon } from "lucide-react";
import { aiAction } from "~/actions/ai-action";
import { useMutation, useQueryClient } from "@tanstack/react-query";

type FormProps = {
	onSubmit: (newTask: NewTask) => void;
	form: UseFormReturn<NewTask, undefined>;
	assignees: User[];
	sprints: Sprint[];
};

const TaskCreateForm = ({ onSubmit, form, assignees, sprints }: FormProps) => {
	// Framer motion transition
	const transition = {
		opacity: { ease: [0.075, 0.82, 0.165, 1] },
		layout: { duration: 0.1 },
	};

	const [isLoading, setIsLoading] = useState(false);

	const aiAutoComplete = async (title: string, description: string) => {
		setIsLoading(true);
		const airesponse = await aiAction(title, description, assignees);
		setIsLoading(false);
		if (airesponse) {
			const userName = assignees.find(
				(user) => user.username === airesponse.assignee,
			)?.username;
			form.setValue("status", airesponse.status);
			form.setValue("priority", airesponse.priority);
			form.setValue("type", airesponse.type);
			if (userName) {
				form.setValue("assignee", userName);
			}
		}
	};

	return (
		<form className="px-4" onSubmit={form.handleSubmit(onSubmit)}>
			<input type="hidden" {...form.register("projectId")} />
			<Input
				type="text"
				className="m-0 border-none p-0 text-lg focus-visible:ring-transparent"
				placeholder="Task Title"
				{...form.register("title")}
				autoFocus
				autoComplete="off"
			/>
			<Textarea
				className="m-0 resize-none border-none p-0 focus-visible:ring-transparent"
				placeholder="Add a description..."
				rows={2}
				{...form.register("description")}
			/>
			<motion.div
				layout
				layoutRoot
				transition={transition}
				className={cn(
					"flex gap-2",
					isLoading ? "pointer-events-none opacity-50" : "",
				)}
				aria-disabled={isLoading}
			>
				{form.watch("description") ? (
					<motion.div
						layout
						className="h-[30px]"
						transition={transition}
					>
						<Button
							disabled={isLoading}
							type="button"
							size="icon"
							className="h-[30px]"
							onClick={() =>
								aiAutoComplete(
									form.watch("title"),
									form.watch("description"),
								)
							}
						>
							{isLoading ? (
								<Loader2 className="h-4 w-4 animate-spin" />
							) : (
								<SparkleIcon className="h-4 w-4" />
							)}
						</Button>
					</motion.div>
				) : null}
				{Object.keys(defaultValues)
					.filter(
						(col) =>
							col !== "id" &&
							col !== "pending" &&
							col !== "projectId" &&
							col !== "backlogOrder" &&
							col !== "boardOrder" &&
							getTaskConfig(col).type === "select",
					)
					.map((col) => {
						const config = buildDynamicOptions(
							getTaskConfig(col),
							col,
							assignees,
							sprints,
						);
						if (config.type === "select")
							return (
								<motion.div
									key={col}
									layout
									transition={transition}
									className="flex-1"
								>
									<PropertySelect
										config={config}
										col={col as keyof NewTask}
										form={form}
										onSubmit={onSubmit}
										isNew={true}
									/>
								</motion.div>
							);
					})}
			</motion.div>
		</form>
	);
};

type Props = {
	projectId: string;
	assignees: User[];
	sprints: Sprint[];
};

const CreateTask = ({ projectId, assignees, sprints }: Props) => {
	const [open, setOpen] = useState(false);
	const queryClient = useQueryClient();

	const project = useNavigationStore((state) => state.currentProject);
	const defaultValuesWithProjectId = useMemo(
		() => ({
			...defaultValues,
			projectId: parseInt(projectId),
		}),
		[projectId],
	);

	const addTaskMutation = useMutation({
		mutationFn: ({ data }: { data: NewTask }) => createTask(data),
		onMutate: async ({ data }) => {
			await queryClient.cancelQueries({ queryKey: ["tasks"] });

			const previousTasks = queryClient.getQueryData<Task[]>(["tasks"]);

			queryClient.setQueryData<Task[]>(["tasks"], (old) => [
				...(old ?? []),
				{
					...data,
					backlogOrder: 1000000,
					projectId: parseInt(projectId),
					id: -1,
				},
			]);
			setOpen(false);

			return { previousTasks };
		},
		onSuccess: async () => {
			await queryClient.invalidateQueries({ queryKey: ["tasks"] });
			toast.success("Task created successfully!");
			setOpen(false);
			form.reset();
		},
		onError: (err) => {
			setOpen(true);
			toast.error(`Failed to create task: ${err.message}`);
		},
	});

	const form = useForm<NewTask>({
		resolver: zodResolver(insertTaskSchema__required),
		defaultValues: defaultValuesWithProjectId,
		mode: "onChange",
	});

	function handleSubmit(newTask: NewTask) {
		addTaskMutation.mutate({ data: newTask });
	}

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger asChild>
				<Button className="gap-1 font-bold" size="sm">
					New
				</Button>
			</DialogTrigger>
			<DialogContent className="min-w-[600px] max-w-fit p-0">
				<DialogHeader className="px-4 pt-4">
					<DialogTitle className="flex items-center gap-[0.5ch]">
						{project ? (
							<div className="flex items-center gap-[0.5ch] text-sm">
								<p className="rounded-sm bg-accent px-2 py-1 font-bold">
									{project.name} ({project.id})
								</p>
								<ChevronRight className="my-1 h-3 w-3 text-muted-foreground" />
							</div>
						) : null}
						New Task
					</DialogTitle>
				</DialogHeader>
				<TaskCreateForm
					onSubmit={handleSubmit}
					form={form}
					assignees={assignees}
					sprints={sprints}
				/>
				<DialogFooter className="border-t px-4 py-2">
					<Button
						size="sm"
						onClick={() => form.handleSubmit(handleSubmit)()}
					>
						Create Task
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
};

export default CreateTask;
