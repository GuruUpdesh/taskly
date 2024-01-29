"use client";

import React, { useMemo, useState } from "react";
import {
	buildDynamicOptions,
	defaultValues,
	getTaskConfig,
} from "~/entities/task-entity";
import { useProjectStore } from "~/store/project";
import { type UseFormReturn, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
	type NewTask,
	type User,
	insertTaskSchema__required,
} from "~/server/db/schema";
import { createTask } from "~/actions/task-actions";
import { throwClientError } from "~/utils/errors";
import { toast } from "sonner";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import DataCellSelect from "./task/property/propery-select";
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

type FormProps = {
	onSubmit: (newTask: NewTask) => Promise<void>;
	form: UseFormReturn<NewTask, undefined>;
	asignees: User[];
};

const TaskCreateForm = ({ onSubmit, form, asignees }: FormProps) => {
	// Framer motion transition
	const transition = {
		opacity: { ease: [0.075, 0.82, 0.165, 1] },
		layout: { duration: 0.1 },
	};

	return (
		<form className="px-4">
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
				className="flex gap-2"
			>
				{form.watch("description") ? (
					<motion.div
						layout
						className="h-[30px]"
						transition={transition}
					>
						<Button size="icon" className={cn("h-[30px]")}>
							<SparkleIcon className="h-4 w-4" />
						</Button>
					</motion.div>
				) : null}
				{Object.keys(defaultValues)
					.filter(
						(col) =>
							col !== "id" &&
							col !== "pending" &&
							col !== "projectId" &&
							getTaskConfig(col).type === "select",
					)
					.map((col) => {
						const config = buildDynamicOptions(
							getTaskConfig(col),
							col,
							asignees,
						);
						if (config.type === "select")
							return (
								<motion.div
									key={col}
									layout
									transition={transition}
									className="flex-1"
								>
									<DataCellSelect
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
	asignees: User[];
};

const CreateTask = ({ projectId, asignees }: Props) => {
	const [open, setOpen] = useState(false);
	const [isLoading, setIsLoading] = useState(false);

	const project = useProjectStore((state) => state.project);
	const defaultValuesWithProjectId = useMemo(
		() => ({
			...defaultValues,
			projectId: parseInt(projectId),
		}),
		[projectId],
	);

	const form = useForm<NewTask>({
		resolver: zodResolver(insertTaskSchema__required),
		defaultValues: defaultValuesWithProjectId,
	});

	async function handleSubmit(newTask: NewTask) {
		setIsLoading(true);
		try {
			await createTask(newTask);
			form.reset();
			setOpen(false);
			toast.success("Task created!");
		} catch (error) {
			throwClientError("Failed to create task");
		} finally {
			setIsLoading(false);
		}
	}

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger asChild>
				<Button className="gap-1 font-bold" size="sm">
					New
				</Button>
			</DialogTrigger>
			<DialogContent className="min-w-[600px] p-0">
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
					asignees={asignees}
				/>
				<DialogFooter className="border-t px-4 py-2">
					<Button
						size="sm"
						onClick={() => form.handleSubmit(handleSubmit)()}
						disabled={isLoading}
					>
						{isLoading ? "Creating Task" : "Create Task"}
						{isLoading ? (
							<Loader2 className="ml-2 h-4 w-4 animate-spin" />
						) : null}
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
};

export default CreateTask;
