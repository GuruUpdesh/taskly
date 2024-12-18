"use client";

import React, { useState } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { InfoCircledIcon } from "@radix-ui/react-icons";
import { ChevronRight, Loader2, Sparkle } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { useShallow } from "zustand/react/shallow";

import { getCurrentSprintForProject } from "~/actions/sprint-actions";
import { createTask } from "~/actions/task-actions";
import Message from "~/components/Message";
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
import { Form, FormField, FormItem, FormMessage } from "~/components/ui/form";
import { Textarea } from "~/components/ui/textarea";
import { aiGenerateTask } from "~/features/ai/actions/ai-action";
import { AIDAILYLIMIT, timeTillNextReset } from "~/features/ai/utils/aiLimit";
import { useRegisterCommands } from "~/features/cmd-menu/registerCommands";
import { taskNameToBranchName } from "~/features/tasks/utils/task-name-branch-converters";
import { useRealtimeStore } from "~/store/realtime";
import { useUserStore } from "~/store/user";

type Props = {
	projectId: string;
};

const formSchema = z.object({
	description: z.string().max(1000),
});

const AiDialog = ({ projectId }: Props) => {
	const [open, setOpen] = useState(false);
	const [project, assignees] = useRealtimeStore(
		useShallow((state) => [state.project, state.assignees]),
	);
	const aiUsageCount = useUserStore((state) => state.aiUsageCount);

	useRegisterCommands([
		{
			id: "ai-task-creation",
			label: "AI Task Creation",
			icon: <Sparkle className="h-4 w-4" />,
			priority: 4,
			shortcut: [],
			action: () => {
				setOpen(true);
			},
		},
	]);

	function resetForm() {
		form.reset({
			description: "",
		});
	}

	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			description: "",
		},
	});

	async function onSubmit(values: z.infer<typeof formSchema>) {
		const response = await aiGenerateTask(
			values.description,
			parseInt(projectId),
			assignees,
		);

		if ((!response.success || response.error) ?? !response.tasks) {
			if (response.error === "AI usage limit reached") {
				toast.error(
					`AI daily limit reached. Please try again in ${timeTillNextReset()} hours.`,
				);
			}

			toast.error(response.error);
			return;
		}

		const currentSprint = await getCurrentSprintForProject(
			parseInt(projectId),
		);

		const createTasksPromises = response.tasks.map((task) =>
			createTask({
				...task,
				title: task.title,
				projectId: parseInt(projectId),
				backlogOrder: 1000000,
				insertedDate: new Date(),
				lastEditedAt: null,
				branchName: taskNameToBranchName(task.title),
				sprintId: currentSprint ? String(currentSprint.id) : "-1",
			}),
		);

		const results = await Promise.allSettled(createTasksPromises);

		const addedIds = [];
		results.forEach((result, index) => {
			if (result.status === "fulfilled") {
				console.log(
					`Task ${index} created successfully:`,
					result.value,
				);
				if (result.value) {
					addedIds.push(result.value.id);
				}
			} else {
				console.error(`Task ${index} failed to create:`, result.reason);
			}
		});

		if (addedIds.length === 0) {
			toast.error("Something went wrong while creating AI tasks");
		}
		toast.success(`AI created ${addedIds.length} tasks`);

		resetForm();
		setOpen(false);
	}

	if (project?.isAiEnabled === false) {
		return null;
	}

	return (
		<>
			<Dialog
				open={open}
				onOpenChange={(open: boolean) => {
					if (!open) {
						resetForm();
					}
					setOpen(open);
				}}
			>
				<SimpleTooltip label="Task Creator">
					<DialogTrigger asChild>
						<Button
							variant="outline"
							size="icon"
							className="h-[36px] rounded-xl bg-background-dialog"
						>
							<Sparkle className="h-4 w-4" />
							<span className="sr-only">Open Task Creator</span>
						</Button>
					</DialogTrigger>
				</SimpleTooltip>
				<DialogContent>
					<DialogHeader>
						<DialogTitle className="flex items-center gap-2">
							<Sparkle className="h-4 w-4" />
							AI Task Creator
						</DialogTitle>
						{aiUsageCount >= AIDAILYLIMIT && (
							<Message
								type="error"
								className="mt-2 w-full flex-shrink"
							>
								You have reached the daily AI limit. <br />
								Your usage will reset in {timeTillNextReset()}{" "}
								hours.
							</Message>
						)}
					</DialogHeader>
					{aiUsageCount < AIDAILYLIMIT && (
						<Form {...form}>
							<form onSubmit={form.handleSubmit(onSubmit)}>
								<FormField
									control={form.control}
									name="description"
									render={({ field }) => (
										<FormItem>
											<Textarea
												placeholder="Describe the tasks you would like to create..."
												className="h-[200px] max-h-[180px] bg-transparent"
												{...field}
											/>
											<FormMessage />
										</FormItem>
									)}
								/>
							</form>
						</Form>
					)}
					<DialogFooter>
						<SimpleTooltip
							label={`Resets in ${timeTillNextReset()} hours`}
						>
							<span className="flex items-center gap-1 text-sm text-muted-foreground">
								<InfoCircledIcon className="h-4 w-4" />
								Daily Usage: {aiUsageCount}/{AIDAILYLIMIT}
							</span>
						</SimpleTooltip>
						<div className="flex-1" />
						<Button
							className="flex items-center gap-2"
							onClick={form.handleSubmit(onSubmit)}
							disabled={
								!form.formState.isValid ||
								!form.formState.isDirty ||
								form.formState.isSubmitting
							}
							variant="secondary"
						>
							{form.formState.isSubmitting
								? "Creating"
								: "Create"}
							{form.formState.isSubmitting ? (
								<Loader2 className="h-4 w-4 animate-spin" />
							) : (
								<ChevronRight className="h-4 w-4" />
							)}
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>
		</>
	);
};

export default AiDialog;
