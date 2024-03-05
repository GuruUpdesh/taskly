/* eslint-disable @typescript-eslint/no-unsafe-member-access */
"use client";

import React, { useCallback, useEffect, useMemo } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import type { UseMutationResult } from "@tanstack/react-query";
import { cva, type VariantProps } from "class-variance-authority";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { useShallow } from "zustand/react/shallow";

import {
	taskFormSchema,
	type TaskFormType,
} from "~/components/backlog/create-task";
import type { UpdateTask } from "~/components/backlog/tasks";
import { type TaskProperty, getPropertyConfig } from "~/config/TaskConfigType";
import { cn } from "~/lib/utils";
import { type Task as TaskType } from "~/server/db/schema";
import { useAppStore } from "~/store/app";

import Property from "./property/property";
import TaskDropDownMenu from "./task-dropdown-menu";

const taskVariants = cva(["flex items-center gap-2"], {
	variants: {
		variant: {
			backlog:
				"flex items-center justify-between border-b py-2 hover:bg-accent-foreground/5",
			list: "",
			board: "flex flex-col p-2 rounded-md border bg-accent/25 hover:bg-accent w-full max-w-full overflow-hidden group",
		},
	},
	defaultVariants: {
		variant: "backlog",
	},
});

export type VariantPropsType = VariantProps<typeof taskVariants>;

const orders: Record<
	Exclude<VariantPropsType["variant"], null | undefined>,
	{ key: TaskProperty; size: "default" | "icon" }[][]
> = {
	backlog: [
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
	],
	list: [
		[
			{ key: "priority", size: "default" },
			{ key: "points", size: "default" },
			{ key: "status", size: "default" },
			{ key: "type", size: "default" },
			{ key: "assignee", size: "default" },
			{ key: "sprintId", size: "default" },
		],
	],
	board: [
		[
			{ key: "title", size: "default" },
			{ key: "assignee", size: "icon" },
		],
		[{ key: "description", size: "icon" }],
		[
			{ key: "status", size: "icon" },
			{ key: "priority", size: "icon" },
			{ key: "points", size: "icon" },
			{ key: "sprintId", size: "icon" },
			{ key: "type", size: "default" },
		],
	],
};

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
	const [assignees, sprints] = useAppStore(
		useShallow((state) => [state.assignees, state.sprints]),
	);

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
				...changes,
			},
		});
	}

	const renderProperties = useCallback(() => {
		if (!variant) return null;

		return orders[variant].map((group, groupIdx) => (
			<div
				key={groupIdx}
				className={cn({
					"flex flex-shrink items-center gap-2 text-foreground first:min-w-0 first:flex-grow first:pl-4 last:pr-4":
						variant === "backlog",
					"flex w-full flex-col gap-2": variant === "list",
					"flex w-full flex-shrink items-center gap-2 text-foreground first:justify-between last:flex-wrap":
						variant === "board",
				})}
			>
				{group.map((item, idx) => {
					const config = getPropertyConfig(
						item.key,
						assignees,
						sprints,
					);
					switch (variant) {
						case "backlog":
							return (
								<Property
									key={idx}
									config={config}
									form={form}
									onSubmit={onSubmit}
									variant={variant}
									size={item.size}
								/>
							);
						case "list":
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
										variant={variant}
										className="col-span-2"
									/>
								</div>
							);
						case "board":
							return (
								<Property
									key={idx}
									config={config}
									form={form}
									onSubmit={onSubmit}
									variant={variant}
									size={item.size}
								/>
							);
						default:
							return null;
					}
				})}
			</div>
		));
	}, [JSON.stringify(task), variant, assignees, sprints]);

	if (variant === "list") {
		return (
			<div className={taskVariants({ variant: variant })}>
				{renderProperties()}
			</div>
		);
	}

	if (variant === "board") {
		return (
			<TaskDropDownMenu
				deleteTaskMutation={deleteTaskMutation}
				task={task}
			>
				<Link href={`/project/${projectId}/task/${task.id}`}>
					<div className={taskVariants({ variant: variant })}>
						{renderProperties()}
					</div>
				</Link>
			</TaskDropDownMenu>
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
