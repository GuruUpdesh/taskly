"use client";

import React, { useState } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { DialogClose } from "@radix-ui/react-dialog";
import { InfoCircledIcon } from "@radix-ui/react-icons";
import { ChevronRight, Loader2, SparklesIcon } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { aiGenerateTask } from "~/actions/ai/ai-action";
import { createTask } from "~/actions/application/task-actions";
import Message from "~/app/components/Message";
import SimpleTooltip from "~/app/components/SimpleTooltip";
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
import { AIDAILYLIMIT, timeTillNextReset } from "~/config/aiLimit";
import { schemaValidators } from "~/config/taskConfigType";
import { useRealtimeStore } from "~/store/realtime";
import { useUserStore } from "~/store/user";
import { taskNameToBranchName } from "~/utils/task-name-branch-converters";

type Props = {
	projectId: string;
};

const formSchema = z.object({
	description: z.string().max(1000),
});

const AiDialog = ({ projectId }: Props) => {
	const [open, setOpen] = useState(false);
	const project = useRealtimeStore((state) => state.project);
	const aiUsageCount = useUserStore((state) => state.aiUsageCount);

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
		const result = await aiGenerateTask(
			values.description,
			parseInt(projectId),
		);

		if (!result) {
			toast.error(
				`AI daily limit reached. Please try again in ${timeTillNextReset()} hours.`,
			);
			return;
		}

		const jsonResult = JSON.parse(result) as unknown;

		const schema = z.array(
			z.object({
				title: schemaValidators.title,
				description: schemaValidators.description,
				status: schemaValidators.status,
				points: schemaValidators.points,
				priority: schemaValidators.priority,
				type: schemaValidators.type,
				assignee: schemaValidators.assignee,
				sprintId: schemaValidators.sprintId,
			}),
		);

		const tasks = schema.parse(jsonResult);

		const createTasksPromises = tasks.map((task) =>
			createTask({
				...task,
				projectId: parseInt(projectId),
				boardOrder: 1000000,
				backlogOrder: 1000000,
				insertedDate: new Date(),
				lastEditedAt: null,
				branchName: taskNameToBranchName(task.title),
			}),
		);

		const results = await Promise.allSettled(createTasksPromises);

		results.forEach((result, index) => {
			if (result.status === "fulfilled") {
				console.log(
					`Task ${index} created successfully:`,
					result.value,
				);
			} else {
				console.error(`Task ${index} failed to create:`, result.reason);
			}
		});

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
				<SimpleTooltip label="AI Task Creation">
					<DialogTrigger asChild>
						<Button
							variant="outline"
							size="sm"
							className="bg-transparent"
						>
							<SparklesIcon className="h-4 w-4" />
						</Button>
					</DialogTrigger>
				</SimpleTooltip>
				<DialogContent>
					<DialogHeader>
						<DialogTitle className="flex items-center gap-2">
							<SparklesIcon className="h-4 w-4" />
							AI Task Creation
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
												placeholder="Describe the task or tasks you would like to create..."
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
						<DialogClose asChild>
							<Button
								type="button"
								variant="outline"
								onClick={resetForm}
								className="bg-transparent"
							>
								Close
							</Button>
						</DialogClose>
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
								? "Submitting"
								: "Submit"}
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
