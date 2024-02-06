/* eslint-disable @typescript-eslint/no-unsafe-member-access */
"use client";

/**
 *  Defines the task component for the backlog and board views
 *  - Defines & renders the task properties
 *  - Handles the form for updating the task
 * 	- Styles the container for the task properties
 *  - Renders the task dropdown menu
 */

// hooks
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";

// types and schemas
import {
	type User,
	type NewTask,
	type Task as TaskType,
} from "~/server/db/schema";
import { type Action } from "~/utils/action";
import type { UseMutationResult } from "@tanstack/react-query";
import type { UpdateTask } from "~/components/page/backlog/tasks";
import { taskSchema } from "~/entities/task-entity";
import { zodResolver } from "@hookform/resolvers/zod";

// components
import TaskDropDownMenu from "./task-dropdown-menu";
import Property from "./property/property";
import Link from "next/link";

type Props = {
	task: TaskType;
	assignees: User[];
	addTaskMutation: UseMutationResult<
		Action<TaskType>,
		Error,
		UpdateTask,
		unknown
	>;
	deleteTaskMutation: UseMutationResult<
		Action<number>,
		Error,
		number,
		unknown
	>;
	projectId: string;
	containerClassName?: string;
	groupClassName?: string;
};

// configures the grouping and display type of each property
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

const Task = ({
	task,
	assignees,
	addTaskMutation,
	deleteTaskMutation,
	projectId,
	containerClassName = "flex items-center justify-between border-b py-2",
	groupClassName = "flex flex-shrink items-center gap-2 first:min-w-0 first:flex-grow first:pl-8 last:pr-8",
}: Props) => {
	// form definition and handling
	const form = useForm<TaskType>({
		resolver: zodResolver(taskSchema),
		defaultValues: { ...task },
	});

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

	useEffect(() => {
		// reset the form when task changes
		form.reset({ ...task });
	}, [JSON.stringify(task)]);

	function renderProperties() {
		return order.map((group, groupIdx) => (
			<div key={groupIdx} className={groupClassName}>
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
		<TaskDropDownMenu deleteTaskMutation={deleteTaskMutation} task={task}>
			<Link href={`/project/${projectId}/task/${task.id}`}>
				<div className={containerClassName}>{renderProperties()}</div>
			</Link>
		</TaskDropDownMenu>
	);
};

export default Task;
