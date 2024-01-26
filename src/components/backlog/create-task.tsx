"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { ChevronRight, Loader2, SparkleIcon } from "lucide-react";
import React, { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { createTask } from "~/actions/task-actions";
import { Button } from "~/components/ui/button";
import {
	Dialog,
	DialogHeader,
	DialogTrigger,
	DialogContent,
	DialogTitle,
	DialogFooter,
} from "~/components/ui/dialog";
import { defaultValues, getTaskConfig } from "~/entities/task-entity";
import { NewTask, insertTaskSchema__required } from "~/server/db/schema";
import { useProjectStore } from "~/store/project";
import { throwClientError } from "~/utils/errors";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import DataCellSelect from "./propery-select";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "~/components/ui/select";
import { cva } from "class-variance-authority";
import { cn } from "~/lib/utils";
import { motion } from "framer-motion";
import { toast } from "sonner";

const optionVariants = cva(
	[
		"rounded-full border pl-2 pr-3 py-1 flex items-center space-x-2 whitespace-nowrap flex",
	],
	{
		variants: {
			color: {
				grey: "border-gray-700 bg-gray-900 text-gray-300 focus:bg-gray-700 focus:text-gray-100",
				yellow: "border-yellow-700 bg-yellow-900 text-yellow-300 focus:bg-yellow-700 focus:text-yellow-100",
				red: "border-red-700 bg-red-900 text-red-300 focus:bg-red-700 focus:text-red-100",
				purple: "border-violet-700 bg-violet-900 text-violet-300 focus:bg-violet-700 focus:text-violet-100",
				blue: "border-sky-700 bg-sky-900 text-sky-300 focus:bg-sky-700 focus:text-sky-100 ",
				green: "border-green-700 bg-green-900 text-green-300 focus:bg-green-700 focus:text-green-100",
			},
		},
		defaultVariants: {
			color: "grey",
		},
	},
);

type Props = {
	projectId: string;
};

const CreateTask = ({ projectId }: Props) => {
	const [open, setOpen] = useState(false);
	const project = useProjectStore((state) => state.project);

	defaultValues.projectId = parseInt(projectId);

	const form = useForm<NewTask>({
		resolver: zodResolver(insertTaskSchema__required),
		defaultValues: defaultValues,
	});
	const [isLoading, setIsLoading] = useState(false);

	async function onSubmit(newTask: NewTask) {
		setIsLoading(true);
		await createTask(newTask);
		setIsLoading(false);
		form.reset();
		setOpen(false);

		toast.success("Task created!");
	}

	const transition = {
		opacity: { ease: [0.075, 0.82, 0.165, 1] },
		layout: { duration: 0.1 },
	};

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
							.map((col, idx) => {
								const config = getTaskConfig(col);
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
				<DialogFooter className="border-t px-4 py-2">
					<Button
						size="sm"
						onClick={() => form.handleSubmit(onSubmit)()}
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
