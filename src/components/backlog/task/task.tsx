/* eslint-disable @typescript-eslint/no-unsafe-member-access */
"use client";

import React, { useEffect } from "react";
import {
	type User,
	type NewTask,
	type Task as TaskType,
} from "~/server/db/schema";
import Property from "./property/property";
import { taskSchema } from "~/entities/task-entity";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { UseMutationResult } from "@tanstack/react-query";
import type { UpdateTask } from "~/components/backlog/tasks";
import TaskDropDownMenu from "./task-dropdown-menu";
import Link from "next/link";

type Props = {
	task: TaskType;
	assignees: User[];
	addTaskMutation: UseMutationResult<void, Error, UpdateTask, unknown>;
	deleteTaskMutation: UseMutationResult<void, Error, number, unknown>;
	projectId: string;
};

const Task = ({
	task,
	assignees,
	addTaskMutation,
	deleteTaskMutation,
	projectId,
}: Props) => {
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
			{ key: "status", size: "icon" },
			{ key: "title", size: "default" },
			{ key: "description", size: "icon" },
		],
		[
			{ key: "type", size: "default" },
			{ key: "assignee", size: "icon" },
		],
	] as { key: keyof TaskType; size: "default" | "icon" }[][];

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
					if (item.key === "id" || item.key === "projectId")
						return null;
					return (
						<Property
							key={idx}
							property={item.key}
							form={form}
							onSubmit={onSubmit}
							assignees={assignees}
							size={item.size}
						/>
					);
				})}
			</div>
		));
	}

	return (
		<Link href={`/project/${projectId}/task/${task.id}`}>
			<TaskDropDownMenu
				deleteTaskMutation={deleteTaskMutation}
				task={task}
			>
				{renderProperties()}
			</TaskDropDownMenu>
		</Link>
	);
};

export default Task;
