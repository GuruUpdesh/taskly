/* eslint-disable @typescript-eslint/no-unsafe-member-access */
"use client";

import React, { useEffect } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import type { UseMutationResult } from "@tanstack/react-query";
import Link from "next/link";
import { useForm } from "react-hook-form";

import type { UpdateTask } from "~/components/backlog/tasks";
import { taskSchema } from "~/config/task-entity";
import { type TaskProperty, getPropertyConfig } from "~/config/TaskConfigType";
import { type NewTask, type Task as TaskType } from "~/server/db/schema";
import { useAppStore } from "~/store/app";

import Property from "./property/property";
import TaskDropDownMenu from "./task-dropdown-menu";

type Props = {
	task: TaskType;
	addTaskMutation: UseMutationResult<void, Error, UpdateTask, unknown>;
	deleteTaskMutation: UseMutationResult<void, Error, number, unknown>;
	projectId: string;
};

const Task = ({
	task,
	addTaskMutation,
	deleteTaskMutation,
	projectId,
}: Props) => {
	const [assignees, sprints] = useAppStore((state) => [
		state.assignees,
		state.sprints,
	]);

	const form = useForm<NewTask>({
		resolver: zodResolver(taskSchema),
		defaultValues: { ...task },
	});

	useEffect(() => {
		form.reset({ ...task });
	}, [JSON.stringify(task)]);

	const order = [
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

	function onSubmit(newTask: NewTask) {
		newTask.projectId = task.projectId;
		const changes = Object.keys(newTask).reduce((acc, key) => {
			if (newTask[key as keyof NewTask] !== task[key as keyof TaskType]) {
				return { ...acc, [key]: newTask[key as keyof NewTask] };
			}
			return acc;
		}, {});

		if (Object.keys(changes).length === 0) return;

		addTaskMutation.mutate({
			id: task.id,
			newTask: { ...task, ...changes },
		});
	}

	function renderProperties() {
		return order.map((group, groupIdx) => (
			<div
				key={groupIdx}
				className="flex flex-shrink items-center gap-2 first:min-w-0 first:flex-grow first:pl-8 last:pr-8"
			>
				{group.map((item, idx) => {
					const config = getPropertyConfig(
						item.key,
						assignees,
						sprints,
					);
					return (
						<Property
							key={idx}
							config={config}
							form={form}
							onSubmit={onSubmit}
							size={item.size}
						/>
					);
				})}
			</div>
		));
	}

	return (
		<TaskDropDownMenu deleteTaskMutation={deleteTaskMutation} task={task}>
			<Link href={`/project/${projectId}/task/${task.id}`}>
				<div className="flex items-center justify-between border-b py-2 hover:bg-accent-foreground/5">
					{renderProperties()}
				</div>
			</Link>
		</TaskDropDownMenu>
	);
};

export default Task;
