"use client";

import React, { useCallback, useEffect } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowTopRightIcon } from "@radix-ui/react-icons";
import type { UseMutationResult } from "@tanstack/react-query";
import _debounce from "lodash/debounce";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { type UpdateTask } from "~/components/backlog/tasks";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Separator } from "~/components/ui/separator";
import { Textarea } from "~/components/ui/textarea";
import type { Comment as CommentType, NewTask, Task, User } from "~/server/db/schema";
import Comment, { CommentWithUser } from "./Comment";
import { cn } from "~/lib/utils";

interface TaskWithComments extends Task {
	comments: CommentWithUser[];
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
				...task,
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

	return (
		<form
			onSubmit={form.handleSubmit(onSubmit)}
			className="container flex flex-grow flex-col gap-4 pb-4 pt-2"
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
			<Textarea
				className="flex-grow resize-none p-4 focus-visible:ring-transparent"
				placeholder="Add a description..."
				{...form.register("description")}
				onChangeCapture={debouncedHandleChange}
				rows={
					(form.watch("description").match(/\n/g) ?? []).length ?? 2
				}
			/>
			<Separator />
			<h3 className="scroll-m-20 text-xl font-semibold tracking-tight">
				Subtasks
			</h3>
			<Button variant="outline" className="w-fit gap-2">
				Add Subtask
				<ArrowTopRightIcon />
			</Button>
			<Separator />
			<div className="overflow-hidden flex flex-col gap-4">
				<h3 className="scroll-m-20 text-xl font-semibold tracking-tight">
					Activity
				</h3>
				{task.comments.map((comment) => {
					return <Comment comment={comment} key={comment.id}/>
				})}
			</div>
		</form >
	);
};

export default PrimaryTaskForm;
