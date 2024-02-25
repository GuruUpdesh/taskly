"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import type { UseMutationResult } from "@tanstack/react-query";
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import {
	buildDynamicOptions,
	getTaskConfig,
	taskSchema,
} from "~/config/task-entity";
import type { NewTask, Sprint, Task, User } from "~/server/db/schema";
import PropertySelect from "~/components/backlog/task/property/propery-select";
import { type TaskConfig } from "~/config/entityTypes";

type Props = {
	task: Task;
	assignees: User[];
	sprints: Sprint[];
	editTaskMutation: UseMutationResult<void, Error, NewTask, unknown>;
};

const insertTaskSchema__Secondary = taskSchema.omit({
	title: true,
	description: true,
});

type FormType = Omit<NewTask, "title" | "description">;

const SecondaryTaskForm = ({
	task,
	assignees,
	sprints,
	editTaskMutation,
}: Props) => {
	const form = useForm<NewTask>({
		resolver: zodResolver(insertTaskSchema__Secondary),
		defaultValues: {
			...task,
		},
	});

	useEffect(() => {
		form.reset({ ...task });
	}, [JSON.stringify(task)]);

	function onSubmit(updatedTask: FormType) {
		editTaskMutation.mutate({ ...task, ...updatedTask });
	}

	const order = [
		{ key: "priority", size: "default" },
		{ key: "status", size: "default" },
		{ key: "type", size: "default" },
		{ key: "assignee", size: "default" },
		{ key: "sprintId", size: "default" },
	] as { key: keyof FormType; size: "default" | "icon" }[];

	function renderProperties() {
		return (
			<>
				{order.map((item, idx) => {
					if (item.key === "projectId") return null;
					const config = buildDynamicOptions(
						getTaskConfig(item.key as keyof TaskConfig),
						item.key,
						assignees,
						sprints,
					);
					return (
						<div key={idx} className="grid grid-cols-3">
							<p className="col-span-1 capitalize text-muted-foreground">
								{item.key}
							</p>
							<div className="col-span-2">
								<PropertySelect
									form={form}
									col={item.key}
									config={config}
									onSubmit={onSubmit}
									size={item.size}
								/>
							</div>
						</div>
					);
				})}
			</>
		);
	}

	return <>{renderProperties()}</>;
};

export default SecondaryTaskForm;
