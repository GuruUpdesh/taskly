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
import type { Comment, NewTask, Task } from "~/server/db/schema";
import Activity from "./activity";
import Comments from "./Comments";

type Props = {
	task: Task;
	editTaskMutation: UseMutationResult<void, Error, UpdateTask, unknown>;
	comments: Comment[];
};

const insertTaskSchema__Primary = z.object({
	title: z.string(),
	description: z.string(),
});

type FormType = Pick<NewTask, "title" | "description">;

const PrimaryTaskForm = ({ task, editTaskMutation, comments }: Props) => {
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

	// loop through comments to get all comments
	console.log(comments);
	const array = ['a', 'b', 'c', 'd', 'e'];

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
			<h3 className="scroll-m-20 text-xl font-semibold tracking-tight">
				Activity
				{comments.map(comment => (
					<div key={comment.id}>
						<p>
							{comment.comment}
						</p>
					</div>
				))}
			</h3>
		</form >
	);
};

export default PrimaryTaskForm;
