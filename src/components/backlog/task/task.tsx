/* eslint-disable @typescript-eslint/no-unsafe-member-access */
"use client";

import React, { useCallback, useEffect, useMemo } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import type { UseMutationResult } from "@tanstack/react-query";
import { cva, type VariantProps } from "class-variance-authority";
import Link from "next/link";
import { useForm } from "react-hook-form";

import type { UpdateTask } from "~/components/backlog/tasks";
import { type TaskProperty, getPropertyConfig } from "~/config/TaskConfigType";
import { cn } from "~/lib/utils";
import { type Task as TaskType } from "~/server/db/schema";
import { useAppStore } from "~/store/app";

import Property from "./property/property";
import TaskDropDownMenu from "./task-dropdown-menu";
import { taskFormSchema, type TaskFormType } from "../create-task";

const taskVariants = cva(["flex items-center gap-2"], {
	variants: {
		variant: {
			backlog:
				"flex items-center justify-between border-b py-2 hover:bg-accent-foreground/5",
			list: "",
		},
	},
	defaultVariants: {
		variant: "backlog",
	},
});

type VariantPropsType = VariantProps<typeof taskVariants>;

const backlogOrder = [
	[
		{ key: "priority", size: "icon" },
		{ key: "points", size: "icon" },
		{ key: "status", size: "icon" },
		{ key: "title", size: "default" },
		{ key: "description", size: "icon" },
	],
	[
		{ key: "type", size: "default" },
		{ key: "assignee", size: "icon" },
		{ key: "sprintId", size: "icon" },
	],
] as { key: TaskProperty; size: "default" | "icon" }[][];

const listOrder = [
	[
		{ key: "priority", size: "default" },
		{ key: "points", size: "default" },
		{ key: "status", size: "default" },
		{ key: "type", size: "default" },
		{ key: "assignee", size: "default" },
		{ key: "sprintId", size: "default" },
	],
] as { key: TaskProperty; size: "default" | "icon" }[][];

interface Props extends VariantPropsType {
	task: TaskType;
	addTaskMutation: UseMutationResult<void, Error, UpdateTask, unknown>;
	deleteTaskMutation: UseMutationResult<void, Error, number, unknown>;
	projectId: string;
}

const Task = ({
	task,
	addTaskMutation,
	deleteTaskMutation,
	projectId,
	variant = "backlog",
}: Props) => {
	const [assignees, sprints] = useAppStore((state) => [
		state.assignees,
		state.sprints,
	]);

	const defaultValues = useMemo(() => {
		return {
			title: task.title,
			description: task.description,
			status: task.status,
			priority: task.priority,
			type: task.type,
			assignee: task.assignee ? task.assignee : "unassigned",
			points: task.points,
			sprintId: String(task.sprintId),
			projectId: parseInt(projectId),
			backlogOrder: task.backlogOrder,
			boardOrder: task.boardOrder,
		};
	}, [JSON.stringify(task)]);

	const form = useForm<TaskFormType>({
		resolver: zodResolver(taskFormSchema),
		defaultValues: defaultValues,
	});

	useEffect(() => {
		form.reset(defaultValues);
	}, [defaultValues]);

	function onSubmit(newTask: TaskFormType) {
		newTask.projectId = task.projectId;
		const changes = Object.keys(newTask).reduce((acc, key) => {
			if (
				newTask[key as keyof TaskFormType] !==
				task[key as keyof TaskType]
			) {
				return { ...acc, [key]: newTask[key as keyof TaskFormType] };
			}
			return acc;
		}, {});

		if (Object.keys(changes).length === 0) return;

		addTaskMutation.mutate({
			id: task.id,
			newTask: {
				...{ ...task, sprintId: String(task.sprintId) },
				...changes,
			},
		});
	}

	const renderProperties = useCallback(() => {
		return (variant === "backlog" ? backlogOrder : listOrder).map(
			(group, groupIdx) => (
				<div
					key={groupIdx}
					className={cn({
						"flex flex-shrink items-center gap-2 first:min-w-0 first:flex-grow first:pl-4 last:pr-4":
							variant === "backlog",
						"flex w-full flex-col gap-2": variant === "list",
					})}
				>
					{group.map((item, idx) => {
						const config = getPropertyConfig(
							item.key,
							assignees,
							sprints,
						);
						if (variant === "backlog") {
							return (
								<Property
									key={idx}
									config={config}
									form={form}
									onSubmit={onSubmit}
									size={item.size}
								/>
							);
						} else if (variant === "list") {
							return (
								<div
									className="grid w-full grid-cols-3"
									key={idx}
								>
									<p className="col-span-1 capitalize text-muted-foreground">
										{config.displayName}
									</p>
									<Property
										config={config}
										form={form}
										onSubmit={onSubmit}
										size={item.size}
										className="col-span-2"
									/>
								</div>
							);
						}
					})}
				</div>
			),
		);
	}, [JSON.stringify(task), variant]);

	if (variant === "list") {
		return (
			<div className={taskVariants({ variant: variant })}>
				{renderProperties()}
			</div>
		);
	}

	return (
		<TaskDropDownMenu deleteTaskMutation={deleteTaskMutation} task={task}>
			<Link href={`/project/${projectId}/task/${task.id}`}>
				<div className={taskVariants({ variant: variant })}>
					{renderProperties()}
				</div>
			</Link>
		</TaskDropDownMenu>
	);
};

export default Task;
