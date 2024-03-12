"use client";

import React, { useState } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { DialogClose } from "@radix-ui/react-dialog";
import { ChevronRight, Loader2, SparklesIcon } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { aiGenerateTask } from "~/actions/ai/ai-action";
import { createTask } from "~/actions/application/task-actions";
import SimpleTooltip from "~/components/general/simple-tooltip";
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
import { schemaValidators } from "~/config/TaskConfigType";
import { useNavigationStore } from "~/store/navigation";
import { taskNameToBranchName } from "~/utils/task-name-branch-converters";

type Props = {
	projectId: string;
};

const formSchema = z.object({
	description: z.string().max(1000),
});

const AiDialog = ({ projectId }: Props) => {
	const [open, setOpen] = useState(false);
	const project = useNavigationStore((state) => state.currentProject);

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
						<Button variant="outline" size="sm">
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
					</DialogHeader>
					<Form {...form}>
						<form onSubmit={form.handleSubmit(onSubmit)}>
							<FormField
								control={form.control}
								name="description"
								render={({ field }) => (
									<FormItem>
										<Textarea
											placeholder="Describe the task you would like to create, and our AI model will create it for you..."
											className="h-[200px] max-h-[350px]"
											{...field}
										/>
										<FormMessage />
									</FormItem>
								)}
							/>
						</form>
					</Form>
					<DialogFooter>
						<DialogClose asChild>
							<Button
								type="button"
								variant="secondary"
								onClick={resetForm}
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
