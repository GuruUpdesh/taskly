"use client";

import React from "react";
import { useEffect, useState } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { ChevronRight, Loader2, SparkleIcon } from "lucide-react";
import { useForm, type UseFormReturn } from "react-hook-form";
import { toast } from "sonner";
import { useShallow } from "zustand/react/shallow";

import { aiAction } from "~/actions/ai/ai-action";
import { createTask } from "~/actions/application/task-actions";
import PropertySelect from "~/app/components/task/property/PropertySelect";
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
import { AIDAILYLIMIT, timeTillNextReset } from "~/config/aiLimit";
import {
	type StatefulTask,
	buildValidator,
	defaultValues,
	getPropertyConfig,
	taskProperties,
} from "~/config/taskConfigType";
import useValidationErrors from "~/hooks/useValidationErrors";
import { cn } from "~/lib/utils";
import {
	type NewTask,
	type Sprint,
	type Task,
	type User,
} from "~/server/db/schema";
import { useAppStore } from "~/store/app";
import { useNavigationStore } from "~/store/navigation";
import { getCurrentSprintId } from "~/utils/getCurrentSprintId";

import SimpleTooltip from "./SimpleTooltip";

type FormProps = {
	onSubmit: (newTask: TaskFormType) => void;
	form: UseFormReturn<TaskFormType, undefined>;
	assignees: User[];
	sprints: Sprint[];
	aiLimitCount: number;
};

export const taskFormSchema = buildValidator([
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
	"branchName",
])
	.refine((data) => !(data.status === "backlog" && data.sprintId !== "-1"), {
		message: "If the status is backlog, there cannot be a sprint.",
	})
	.refine((data) => !(data.sprintId !== "-1" && data.status === "backlog"), {
		message: "If a sprint is selected, the status cannot be backlog.",
	});

export type TaskFormType = Omit<NewTask, "sprintId"> & { sprintId: string };

const TaskCreateForm = ({
	onSubmit,
	form,
	assignees,
	sprints,
	aiLimitCount,
}: FormProps) => {
	const project = useNavigationStore((state) => state.currentProject);

	// Framer motion transition
	const transition = {
		duration: 0.2,
		ease: [0.075, 0.82, 0.165, 1],
	};

	const [isLoading, setIsLoading] = useState(false);

	const aiAutoComplete = async (title: string, description: string) => {
		if (aiLimitCount >= AIDAILYLIMIT) {
			toast.error(
				`AI daily limit reached. Please try again in ${timeTillNextReset()} hours.`,
			);
			return;
		}
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
			form.setValue("points", airesponse.points);
			if (userName) {
				form.setValue("assignee", userName);
			}
			if (airesponse.title) {
				form.setValue("title", airesponse.title);
			}
		}
	};

	return (
		<form className="px-4" onSubmit={form.handleSubmit(onSubmit)}>
			<input type="hidden" {...form.register("projectId")} />
			<Input
				type="text"
				className="m-0 border-none bg-transparent p-0 text-lg ring-offset-transparent focus-visible:ring-transparent"
				placeholder="Task Title"
				{...form.register("title")}
				autoFocus
				autoComplete="off"
			/>
			<Textarea
				className="m-0 resize-none border-none bg-transparent p-0 ring-offset-transparent focus-visible:ring-transparent"
				placeholder="Add a description..."
				rows={2}
				{...form.register("description")}
			/>
			<div
				className={cn(
					"flex gap-2",
					isLoading ? "pointer-events-none opacity-50" : "",
				)}
				aria-disabled={isLoading}
			>
				{form.watch("description") && project?.isAiEnabled ? (
					<motion.div
						className="h-[30px] origin-left"
						initial={{ opacity: 0, scaleX: 0 }}
						animate={{ opacity: 1, scaleX: 1 }}
						transition={transition}
					>
						<SimpleTooltip label="Autocomplete Properties">
							<Button
								disabled={isLoading}
								type="button"
								size="icon"
								className="h-[30px] w-[30px]"
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
						</SimpleTooltip>
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
							<PropertySelect
								key={property}
								config={config}
								form={form}
								onSubmit={onSubmit}
								autoSubmit={false}
								size={
									["sprintId", "assignee", "points"].includes(
										config.key,
									)
										? "icon"
										: "default"
								}
								autoFocus={true}
							/>
						);
				})}
			</div>
		</form>
	);
};

type Props = {
	projectId: string;
	aiLimitCount: number;
	children: React.ReactNode;
};

const CreateTask = ({ projectId, children, aiLimitCount }: Props) => {
	const [assignees, sprints] = useAppStore(
		useShallow((state) => [state.assignees, state.sprints]),
	);
	const [open, setOpen] = useState(false);
	const queryClient = useQueryClient();
	const project = useNavigationStore((state) => state.currentProject);

	const addTaskMutation = useMutation({
		mutationFn: ({ data }: { data: TaskFormType }) => createTask(data),
		onMutate: async ({ data }) => {
			await queryClient.cancelQueries({ queryKey: ["tasks", projectId] });

			const previousTasks = queryClient.getQueryData<Task[]>([
				"tasks",
				projectId,
			]);

			queryClient.setQueryData<StatefulTask[]>(
				["tasks", projectId],
				(old) => [
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
				],
			);
			setOpen(false);

			return { previousTasks };
		},
		onSuccess: async () => {
			await queryClient.invalidateQueries({
				queryKey: ["tasks", projectId],
			});
			toast.success("Task added");
			setOpen(false);
			form.reset();
		},
		onError: (err) => {
			setOpen(true);
			toast.error(`Failed to create task: ${err.message}`);
		},
	});

	const form = useForm<TaskFormType>({
		resolver: zodResolver(taskFormSchema),
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
			branchName: null,
		},
		mode: "onChange",
	});

	useEffect(() => {
		const sprintId = form.watch("sprintId");
		const status = form.watch("status");
		if (status === "backlog" && sprintId !== "-1") {
			form.setValue("status", "todo", {
				shouldDirty: true,
				shouldValidate: true,
			});
		} else if (status !== "backlog" && sprintId === "-1") {
			form.setValue("status", "backlog", {
				shouldDirty: true,
				shouldValidate: true,
			});
		}
	}, [form.watch("sprintId")]);

	useEffect(() => {
		const sprintId = form.watch("sprintId");
		const status = form.watch("status");
		if (status === "backlog" && sprintId !== "-1") {
			form.setValue("sprintId", "-1", {
				shouldDirty: true,
				shouldValidate: true,
			});
		} else if (status !== "backlog" && sprintId === "-1") {
			form.setValue("sprintId", `${getCurrentSprintId(sprints)}`, {
				shouldDirty: true,
				shouldValidate: true,
			});
		}
	}, [form.watch("status")]);

	useValidationErrors(form.formState.errors);

	function handleSubmit(newTask: TaskFormType) {
		console.log(newTask);
		addTaskMutation.mutate({ data: newTask });
	}

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger asChild>{children}</DialogTrigger>
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
					aiLimitCount={aiLimitCount}
				/>
				<DialogFooter className="border-t px-4 py-2">
					<Button
						size="sm"
						onClick={() => form.handleSubmit(handleSubmit)()}
						disabled={!form.formState.isValid}
						variant="secondary"
					>
						Create Task
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
};

export default CreateTask;
