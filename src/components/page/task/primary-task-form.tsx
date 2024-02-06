"use client";

/**
 *  Defines the title and description properties for the task page
 *  - Defines & renders the form for updating the title and description properties
 *  - Styles the container for the title and description properties
 *  - Defines debounced form validation and auto submission
 */

// hooks
import React, { useCallback, useEffect } from "react";
import { useForm } from "react-hook-form";

// types and schemas
import type { NewTask, Task } from "~/server/db/schema";
import type { UseMutationResult } from "@tanstack/react-query";
import { type Action } from "~/utils/action";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

// components
import { Input } from "~/components/ui/input";
import { Textarea } from "~/components/ui/textarea";
import { Separator } from "../../ui/separator";
import { Button } from "../../ui/button";
import { ArrowTopRightIcon } from "@radix-ui/react-icons";

// utils
import _debounce from "lodash/debounce";

type Props = {
	task: Task;
	editTaskMutation: UseMutationResult<Action<Task>, Error, NewTask, unknown>;
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
		editTaskMutation.mutate({ ...task, ...updatedTask });
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
			<h3 className="scroll-m-20 text-xl font-semibold tracking-tight">
				Activity
			</h3>
		</form>
	);
};

export default PrimaryTaskForm;
