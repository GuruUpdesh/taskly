"use client";

import React, { useCallback, useEffect, useRef } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { type MDXEditorMethods } from "@mdxeditor/editor";
import type { UseMutationResult } from "@tanstack/react-query";
import _debounce from "lodash/debounce";
import dynamic from "next/dynamic";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { type UpdateTask } from "~/components/backlog/tasks";
import { Input } from "~/components/ui/input";
import { Separator } from "~/components/ui/separator";
import type { NewTask, Task } from "~/server/db/schema";

import TaskHistoryItem, { type TaskHistoryWithUser } from "./HistoryItem";

const Editor = dynamic(() => import("~/components/task/TextEditor"), {
	ssr: false,
});

interface TaskWithComments extends Task {
	taskHistory: TaskHistoryWithUser[];
}

type Props = {
	task: TaskWithComments;
	editTaskMutation: UseMutationResult<void, Error, UpdateTask, unknown>;
};

const insertTaskSchema__Primary = z.object({
	title: z.string(),
	description: z.string(),
});

type FormType = Pick<NewTask, "title" | "description">;

const PrimaryTaskForm = ({ task, editTaskMutation }: Props) => {
	const form = useForm<FormType>({
		resolver: zodResolver(insertTaskSchema__Primary),
		mode: "onChange",
		defaultValues: {
			title: task.title,
			description: task.description,
		},
	});

	useEffect(() => {
		form.reset({
			title: task.title,
			description: task.description,
		});
	}, [JSON.stringify(task)]);

	function onSubmit(updatedTask: FormType) {
		editTaskMutation.mutate({
			id: task.id,
			newTask: {
				...updatedTask,
				sprintId: String(task.sprintId),
			},
		});
	}

	async function handleChange() {
		const isValid = await form.trigger();
		if (isValid) {
			await form.handleSubmit(onSubmit)();
		}
	}
	const debouncedHandleChange = useCallback(
		// eslint-disable-next-line @typescript-eslint/no-unsafe-call
		_debounce(handleChange, 1000) as () => void,
		[],
	);

	const editorRef = useRef<MDXEditorMethods>(null);

	return (
		<form
			onSubmit={form.handleSubmit(onSubmit)}
			className="flex flex-grow flex-col gap-2 px-4 pb-4 pt-2"
		>
			<Input
				type="text"
				className="m-0 border-none p-0 py-2 text-2xl focus-visible:ring-transparent"
				placeholder="Task Title"
				autoFocus
				autoComplete="off"
				{...form.register("title")}
				onChangeCapture={debouncedHandleChange}
			/>
			<Editor
				editorRef={editorRef}
				markdown={form.watch("description")}
				onChange={(content) => {
					form.setValue("description", content);
					debouncedHandleChange();
				}}
			/>
			{/* <Separator />
			<h3 className="scroll-m-20 text-xl font-semibold tracking-tight">
				Subtasks
			</h3>
			<Button variant="outline" className="w-fit gap-2">
				Add Subtask
				<ArrowTopRightIcon />
			</Button> */}
			<Separator className="my-4" />
			<div className="pb-4">
				<div className="flex flex-col gap-4 overflow-hidden">
					<h3 className="scroll-m-20 text-xl font-semibold tracking-tight">
						Activity
					</h3>
					{task.taskHistory.map((history) => {
						return (
							<TaskHistoryItem
								key={history.id}
								history={history}
							/>
						);
					})}
				</div>
			</div>
		</form>
	);
};

export default PrimaryTaskForm;
