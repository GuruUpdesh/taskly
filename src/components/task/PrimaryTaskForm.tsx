"use client";

import React, { useCallback, useEffect, useMemo } from "react";
import { NewTask, User, type Task } from "~/server/db/schema";
import { Input } from "~/components/ui/input";
import { Textarea } from "~/components/ui/textarea";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
	buildDynamicOptions,
	defaultValues,
	getTaskConfig,
	taskSchema,
} from "~/entities/task-entity";
import DataCellSelect from "../backlog/task/property/propery-select";
import { UseMutationResult } from "@tanstack/react-query";
import { UpdateTask } from "../backlog/tasks";
import useDebounce from "~/hooks/useDebounce";
import { Button } from "../ui/button";
import { z } from "zod";
import _debounce from "lodash/debounce";
import { filterProps } from "framer-motion";

type Props = {
	task: Task;
	assignees: User[];
	editTaskMutation: UseMutationResult<void, Error, NewTask, unknown>;
};

const insertTaskSchema__Primary = z.object({
	title: z.string(),
	description: z.string(),
});

type FormType = Pick<NewTask, "title" | "description">;

const PrimaryTaskForm = ({ task, assignees, editTaskMutation }: Props) => {
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
		console.log("FORM SUBMIT", updatedTask);
		editTaskMutation.mutate({ ...task, ...updatedTask });
	}

	async function handleChange() {
		console.log("FORM CHANGE", form.getValues());
		const isValid = await form.trigger();
		if (isValid) {
			await form.handleSubmit(onSubmit)();
		}
	}
	const debouncedHandleChange = useCallback(
		_debounce(handleChange, 1000),
		[],
	);

	return (
		<form onSubmit={form.handleSubmit(onSubmit)} className="container pt-2">
			<Input
				type="text"
				className="m-0 border-none p-0 text-2xl focus-visible:ring-transparent"
				placeholder="Task Title"
				autoFocus
				autoComplete="off"
				{...form.register("title")}
				onChangeCapture={debouncedHandleChange}
			/>
			<Textarea
				className="m-0 resize-none border-none px-0 pb-2 pt-1 focus-visible:ring-transparent"
				placeholder="Add a description..."
				{...form.register("description")}
                onChangeCapture={debouncedHandleChange}
			/>
		</form>
	);
};

export default PrimaryTaskForm;
