"use client";

import React, { useState } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { DialogClose } from "@radix-ui/react-dialog";
import { ChevronRight, Loader2, SparkleIcon } from "lucide-react";
import { useForm } from "react-hook-form";
import { object, z } from "zod";

import { aiGenerateTask } from "~/actions/ai/ai-action";
import { TaskFormType, taskFormSchema } from "~/components/backlog/create-task";
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
import {
	CreateTaskSchema,
	TaskProperty as TaskPropertyType,
	getPropertyConfig,
	schemaValidators,
} from "~/config/TaskConfigType";
import { useAppStore } from "~/store/app";
import TaskProperty from "~/components/task/TaskProperty";
import { createTask } from "~/actions/application/task-actions";

type Props = {
	projectId: string;
};

const formSchema = z.object({
	description: z.string().max(1000),
});

const AiDialog = ({ projectId }: Props) => {
	const [open, setOpen] = useState(false);
	const [assignees, sprints] = useAppStore((state) => [
		state.assignees,
		state.sprints,
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

	const [task, setTask] = useState<z.infer<typeof CreateTaskSchema> | null>(
		null,
	);
	async function onSubmit(values: z.infer<typeof formSchema>) {
		const result = await aiGenerateTask(
			values.description,
			parseInt(projectId),
		);

		
		const jsonResult = JSON.parse(result) as unknown; 
		console.log(jsonResult);

		const schema = z.array(z.object({
			title: schemaValidators.title,
			description: schemaValidators.description,
			status: schemaValidators.status,
			points: schemaValidators.points,
			priority: schemaValidators.priority,
			type: schemaValidators.type,
			assignee: schemaValidators.assignee,
			sprintId: schemaValidators.sprintId,
		}))
		
		const tasks = schema.parse(jsonResult);

		const createTasksPromises = tasks.map((task) => createTask({
				...task,
				projectId: parseInt(projectId),
				boardOrder: 1000000,
				backlogOrder: 1000000,
				insertedDate: new Date(),
				lastEditedAt: null,
			})
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
				<DialogTrigger asChild>
					<Button variant="outline" size="sm">
						<SparkleIcon className="h-4 w-4" />
					</Button>
				</DialogTrigger>
				<DialogContent>
					<DialogHeader>
						<DialogTitle className="flex items-center gap-2">
							<SparkleIcon className="h-4 w-4" />
							AI Task Creation
						</DialogTitle>
					</DialogHeader>
					{task ? (
						<>
							{Object.keys(task).map((key) => {
								const config = getPropertyConfig(
									key as TaskPropertyType,
									assignees,
									sprints,
								);
								if (config.type === "text") {
									return (
										<p key={config.key}>
											{task[key as keyof typeof task]}
										</p>
									);
								} else if (
									config.type === "enum" ||
									config.type === "dynamic"
								) {
									const option = config.options.find(
										(option) =>
											option.key ===
											task[
												key as keyof typeof task
											]?.toString(),
									);
									if (!option) {
										console.warn(
											`Option not found for ${key}`,
										);
										return null;
									}
									return (
										<TaskProperty
											key={config.key}
											option={option}
											size="default"
											hover={false}
										/>
									);
								}
							})}
						</>
					) : (
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
					)}
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
