"use client";

import React, { useEffect } from "react";
import { useState } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { PlusCircledIcon } from "@radix-ui/react-icons";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import Mention from "@tiptap/extension-mention";
import Placeholder from "@tiptap/extension-placeholder";
import { EditorContent, useEditor } from "@tiptap/react";
import { Loader2, SparkleIcon } from "lucide-react";
import Link from "next/link";
import { useForm } from "react-hook-form";
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
import { smartPropertiesAction } from "~/features/ai/actions/ai-action";
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
import { type NewTask, type Task } from "~/schema";
import { useAppStore } from "~/store/app";
import { useRealtimeStore } from "~/store/realtime";
import { useUserStore } from "~/store/user";
import { getCurrentSprintId } from "~/utils/getCurrentSprintId";

import "~/features/text-editor/tiptap.css";

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

type FormProps = {
	projectId: string;
	close: () => void;
	overrideDefaultValues?: Partial<TaskFormType>;
};

const TaskCreateForm = ({
	projectId,
	close,
	overrideDefaultValues,
}: FormProps) => {
	const [project, assignees, sprints] = useRealtimeStore(
		useShallow((state) => [state.project, state.assignees, state.sprints]),
	);
	const [taskFormState, setTaskFormState, clearTaskFormState] = useAppStore(
		useShallow((state) => [
			state.taskFormState,
			state.setTaskFormState,
			state.clearTaskFormState,
		]),
	);

	const form = useForm<TaskFormType>({
		resolver: zodResolver(taskFormSchema),
		defaultValues: {
			...defaultValues,
			...(taskFormState ?? {}),
			...overrideDefaultValues,
			projectId: parseInt(projectId),
			backlogOrder: 1000000,
			branchName: null,
		},
		mode: "onChange",
	});

	// Save form state to store whenever it changes
	useEffect(() => {
		const subscription = form.watch((values) => {
			// Exclude certain fields that shouldn't be persisted
			// eslint-disable-next-line @typescript-eslint/no-unused-vars
			const { projectId, ...persistableValues } = values;
			setTaskFormState(persistableValues);
		});

		return () => subscription.unsubscribe();
	}, [form, setTaskFormState]);

	function handleChangeCallback(val: string) {
		// This doesn't cover default value case (current handled by backend)
		const currentSprintId = form.watch("sprintId");
		const currentStatus = form.watch("status");

		const formOption = {
			shouldDirty: true,
			shouldValidate: true,
		};

		if (val === currentStatus) {
			if (val === "backlog" && currentSprintId !== "-1") {
				form.setValue("sprintId", "-1", formOption);
			} else if (val !== "backlog" && currentSprintId === "-1") {
				form.setValue(
					"sprintId",
					`${getCurrentSprintId(sprints)}`,
					formOption,
				);
			}
		} else if (val === currentSprintId) {
			if (val === "-1" && currentStatus !== "backlog") {
				form.setValue("status", "backlog", formOption);
			} else if (val !== "-1" && currentStatus === "backlog") {
				form.setValue("status", "todo", formOption);
			}
		}
	}

	function onSubmit(newTask: TaskFormType) {
		addTaskMutation.mutate({ data: newTask });
	}

	const queryClient = useQueryClient();

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
							isNew: true,
						},
						comments: 0,
					},
				],
			);
			clearTaskFormState();
			close();

			return { previousTasks };
		},
		onSuccess: (data) => {
			if (data) {
				const url = `/project/${data.projectId}/task/${data.id}`;
				toast.success("Task added", {
					action: (
						<Button
							size="sm"
							variant="ghost"
							asChild
							className="text-foreground underline"
						>
							<Link href={url}>View</Link>
						</Button>
					),
				});
			} else {
				toast.success("Task added");
			}
			close();
			form.reset();
		},
		onError: (err) => {
			close();
			toast.error(`Failed to create task: ${err.message}`);
		},
	});

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
		const airesponse = await smartPropertiesAction(
			title,
			description,
			assignees,
		);
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

	useValidationErrors(form.formState.errors);

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
			// eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
			const content = e.editor.storage.markdown.getMarkdown() as string;
			form.setValue("description", content, {
				shouldDirty: true,
				shouldValidate: true,
			});
		},
	});

	return (
		<>
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

			<form
				className="flex-1 px-4"
				onSubmit={form.handleSubmit(onSubmit)}
			>
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
						<SimpleTooltip
							label="Apply Smart Properties"
							side="right"
						>
							<Button
								disabled={isLoading}
								type="button"
								size="icon"
								variant="outline"
								className="h-[30px] w-[30px] rounded-lg bg-accent"
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
										[
											"sprintId",
											"assignee",
											"points",
										].includes(config.key)
											? "icon"
											: "default"
									}
									autoFocus={true}
									onChangeCallback={handleChangeCallback}
								/>
							);
					})}
				</div>
			</form>
			<DialogFooter className="border-t px-4 py-2">
				<Button
					size="sm"
					onClick={() => form.handleSubmit(onSubmit)()}
					disabled={!form.formState.isValid}
					variant="secondary"
					className="rounded-xl font-medium"
				>
					Create
				</Button>
			</DialogFooter>
		</>
	);
};

type Props = {
	projectId: string;
	children: React.ReactNode;
	overrideDefaultValues?: Partial<TaskFormType>;
};

const CreateTask = ({ projectId, children, overrideDefaultValues }: Props) => {
	const [open, setOpen] = useState(false);

	useRegisterCommands([
		{
			id: "create-task",
			label: "Add Task",
			icon: <PlusCircledIcon />,
			priority: 5,
			shortcut: [],
			action: () => {
				setOpen(true);
			},
		},
	]);

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger asChild>{children}</DialogTrigger>
			<DialogContent className="flex w-[600px] min-w-[600px] max-w-fit flex-col justify-between p-0">
				<TaskCreateForm
					projectId={projectId}
					overrideDefaultValues={overrideDefaultValues}
					close={() => setOpen(false)}
				/>
			</DialogContent>
		</Dialog>
	);
};

export default CreateTask;
