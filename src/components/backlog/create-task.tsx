"use client";

import React from "react";
import { useEffect, useState } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { ChevronRight, Loader2, SparkleIcon } from "lucide-react";
import { useForm, type UseFormReturn } from "react-hook-form";
import { toast } from "sonner";

import { aiAction } from "~/actions/ai/ai-action";
import { createTask } from "~/actions/application/task-actions";
import { Button } from "~/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "~/components/ui/dialog";
import { Input } from "~/components/ui/input";
import { Textarea } from "~/components/ui/textarea";
import { type StatefulTask } from "~/config/task-entity";
import {
	buildValidator,
	defaultValues,
	getPropertyConfig,
	taskProperties,
} from "~/config/TaskConfigType";
import useValidationErrors from "~/hooks/useValidationErrors";
import { cn } from "~/lib/utils";
import {
	type NewTask,
	type Sprint,
	type Task,
	type User,
} from "~/server/db/schema";
import { useNavigationStore } from "~/store/navigation";
import { getCurrentSprintId } from "~/utils/getCurrentSprintId";



import PropertySelect from "./task/property/propery-select";

type FormProps = {
	onSubmit: (newTask: FormType) => void;
	form: UseFormReturn<FormType, undefined>;
	assignees: User[];
	sprints: Sprint[];
};

const formSchema = buildValidator([
	"projectId",
	"title",
	"description",
	"points",
	"status",
	"priority",
	"type",
	"assignee",
	"sprintId",
	"backlogOrder",
	"boardOrder",
]).refine((data) => !(data.status === "backlog" && data.sprintId !== "-1"), {
	message: "If the status is backlog, there cannot be a sprint.",
})
.refine((data) => !(data.sprintId !== "-1" && data.status === "backlog"), {
	message: "If a sprint is selected, the status cannot be backlog.",
});

export type FormType = Omit<NewTask, "sprintId"> & { sprintId: string };

const TaskCreateForm = ({ onSubmit, form, assignees, sprints }: FormProps) => {
	const project = useNavigationStore((state) => state.currentProject);

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
				{form.watch("description") && project?.isAiEnabled ? (
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
				{taskProperties.map((property) => {
					const config = getPropertyConfig(
						property,
						assignees,
						sprints,
					);
					if (config.type === "enum" || config.type === "dynamic")
						return (
							<motion.div
								key={config.key}
								layout
								transition={transition}
								className="flex-1"
							>
								<PropertySelect
									config={config}
									form={form}
									onSubmit={onSubmit}
									autoSubmit={false}
									
									size={
										["sprintId", "assignee", "priority", "points"].includes(config.key)
											? "icon"
											: "default"
									}
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

	const addTaskMutation = useMutation({
		mutationFn: ({ data }: { data: FormType }) => createTask(data),
		onMutate: async ({ data }) => {
			await queryClient.cancelQueries({ queryKey: ["tasks"] });

			const previousTasks = queryClient.getQueryData<Task[]>(["tasks"]);

			queryClient.setQueryData<StatefulTask[]>(["tasks"], (old) => [
				...(old ?? []),
				{
					...data,
					sprintId: parseInt(data.sprintId),
					backlogOrder: 1000000,
					projectId: parseInt(projectId),
					id: -1,
					options: {
						isPending: true,
					},
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

	const form = useForm<FormType>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			title: defaultValues.title,
			description: defaultValues.description,
			status: defaultValues.status,
			priority: defaultValues.priority,
			type: defaultValues.type,
			assignee: defaultValues.assignee,
			points: defaultValues.points,
			sprintId: defaultValues.sprintId,
			projectId: parseInt(projectId),
			backlogOrder: 1000000,
			boardOrder: 1000000,
		},
		mode: "onChange",
	});

	useEffect(() => {
		const sprintId = form.watch("sprintId");
		const status = form.watch("status");
		if (status === "backlog" && sprintId !== "-1") {
			form.setValue("sprintId", "-1");
		} else if (status !== "backlog" && sprintId === "-1") {
			form.setValue("sprintId", `${getCurrentSprintId(sprints)}`);
		}
	}, [form.watch("sprintId"), form.watch("status")]);

	useValidationErrors(form.formState.errors);

	function handleSubmit(newTask: FormType) {
		console.log(`🌱 Create Task >`, newTask)
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
						disabled={!form.formState.isValid}
					>
						Create Task
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
};

export default CreateTask;
