"use client";

import React from "react";
import { useEffect, useState } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { PlusCircledIcon } from "@radix-ui/react-icons";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import Mention from "@tiptap/extension-mention";
import Placeholder from "@tiptap/extension-placeholder";
import { EditorContent, useEditor } from "@tiptap/react";
import { Loader2, SparkleIcon } from "lucide-react";
import { useForm, type UseFormReturn } from "react-hook-form";
import { toast } from "sonner";
import { useShallow } from "zustand/react/shallow";

import { createTask } from "~/actions/task-actions";
import SimpleTooltip from "~/components/SimpleTooltip";
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
import { aiAction } from "~/features/ai/actions/ai-action";
import { AIDAILYLIMIT, timeTillNextReset } from "~/features/ai/utils/aiLimit";
import { useRegisterCommands } from "~/features/cmd-menu/registerCommands";
import PropertySelect from "~/features/tasks/components/property/PropertySelect";
import {
	type StatefulTask,
	buildValidator,
	defaultValues,
	getPropertyConfig,
	taskProperties,
} from "~/features/tasks/config/taskConfigType";
import useValidationErrors from "~/features/tasks/hooks/useValidationErrors";
import BubbleMenu from "~/features/text-editor/components/BubbleMenu";
import RenderMentionOptions from "~/features/text-editor/components/RenderMentionOptions";
import extensions from "~/features/text-editor/extensions";
import { cn } from "~/lib/utils";
import { type NewTask, type Sprint, type Task, type User } from "~/schema";
import { useRealtimeStore } from "~/store/realtime";
import { useUserStore } from "~/store/user";
import { getCurrentSprintId } from "~/utils/getCurrentSprintId";

import "~/features/text-editor/tiptap.css";

type FormProps = {
	onSubmit: (newTask: TaskFormType) => void;
	form: UseFormReturn<TaskFormType, undefined>;
	assignees: User[];
	sprints: Sprint[];
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
	"branchName",
])
	.refine((data) => !(data.status === "backlog" && data.sprintId !== "-1"), {
		message: "If the status is backlog, there cannot be a sprint.",
	})
	.refine((data) => !(data.sprintId !== "-1" && data.status === "backlog"), {
		message: "If a sprint is selected, the status cannot be backlog.",
	});

export type TaskFormType = Omit<NewTask, "sprintId"> & { sprintId: string };

const TaskCreateForm = ({ onSubmit, form, assignees, sprints }: FormProps) => {
	const project = useRealtimeStore((state) => state.project);
	const aiUsageCount = useUserStore((state) => state.aiUsageCount);

	const [isLoading, setIsLoading] = useState(false);

	const aiAutoComplete = async (title: string, description: string) => {
		if (aiUsageCount >= AIDAILYLIMIT) {
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
		}
	};

	const editor = useEditor({
		immediatelyRender: false,
		extensions: [
			...extensions,
			Placeholder.configure({
				placeholder: "Add a description or type '/' for commands...",
			}),
			Mention.configure({
				HTMLAttributes: {
					class: "mention",
				},
				suggestion: {
					items: ({ query }) => {
						return assignees
							.filter((user) =>
								user.username
									.toLowerCase()
									.startsWith(query.toLowerCase()),
							)
							.slice(0, 5);
					},
					render: RenderMentionOptions,
				},
			}),
		],
		content: form.watch("description"),
		onUpdate: (e) => {
			// eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-assignment
			const content = e.editor.storage.markdown.getMarkdown();
			// eslint-disable-next-line @typescript-eslint/no-unsafe-argument
			form.setValue("description", content, {
				shouldDirty: true,
				shouldValidate: true,
			});
		},
	});

	return (
		<form className="flex-1 px-4" onSubmit={form.handleSubmit(onSubmit)}>
			<input type="hidden" {...form.register("projectId")} />
			<Input
				type="text"
				className="m-0 border-none bg-transparent p-0 text-lg ring-offset-transparent focus-visible:ring-transparent"
				placeholder="New Task"
				{...form.register("title")}
				autoFocus
				autoComplete="off"
			/>
			<div className="max-h-[60vh] flex-1 overflow-scroll">
				{editor && <BubbleMenu editor={editor} />}
				<EditorContent editor={editor} />
			</div>
			<div
				className={cn(
					"mt-2 flex gap-2",
					isLoading ? "pointer-events-none opacity-50" : "",
				)}
				aria-disabled={isLoading}
			>
				{(form.watch("title") || form.watch("description")) &&
				project?.isAiEnabled ? (
					<SimpleTooltip label="Smart Properties">
						<Button
							disabled={isLoading}
							type="button"
							size="icon"
							variant="outline"
							className="h-[30px] w-[30px] bg-transparent"
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
	children: React.ReactNode;
	overrideDefaultValues?: Partial<TaskFormType>;
};

const CreateTask = ({ projectId, children, overrideDefaultValues }: Props) => {
	const [project, assignees, sprints] = useRealtimeStore(
		useShallow((state) => [state.project, state.assignees, state.sprints]),
	);
	const [open, setOpen] = useState(false);
	const queryClient = useQueryClient();

	useRegisterCommands([
		{
			id: "create-task",
			label: "Create Task",
			icon: <PlusCircledIcon />,
			priority: 5,
			shortcut: [],
			action: () => {
				setOpen(true);
			},
		},
	]);

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
						comments: 0,
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
			status: overrideDefaultValues?.status
				? overrideDefaultValues.status
				: defaultValues.status,
			priority: overrideDefaultValues?.priority
				? overrideDefaultValues.priority
				: defaultValues.priority,
			type: overrideDefaultValues?.type
				? overrideDefaultValues.type
				: defaultValues.type,
			assignee: overrideDefaultValues?.assignee
				? overrideDefaultValues.assignee
				: defaultValues.assignee,
			points: overrideDefaultValues?.points
				? overrideDefaultValues.points
				: defaultValues.points,
			sprintId: overrideDefaultValues?.sprintId
				? overrideDefaultValues.sprintId
				: defaultValues.sprintId,
			projectId: parseInt(projectId),
			backlogOrder: 1000000,
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
			console.log("setting sprintId to -1");
			form.setValue("sprintId", "-1", {
				shouldDirty: true,
				shouldValidate: true,
			});
		} else if (status !== "backlog" && sprintId === "-1") {
			console.log("setting sprintId to current sprint");
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
			<DialogContent className="flex w-[600px] min-w-[600px] max-w-fit flex-col justify-between p-0">
				<DialogHeader className="px-4 pt-4">
					<DialogTitle className="flex items-center gap-[0.5ch]">
						{project ? (
							<div className="flex items-center gap-[0.5ch] text-sm">
								<p className="rounded-sm bg-accent px-2 py-1">
									{project.name}
								</p>
							</div>
						) : null}
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
