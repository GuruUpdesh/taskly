/* eslint-disable @typescript-eslint/no-unsafe-member-access */
"use client";

// hooks
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";

// types and schemas
import {
	type User,
	type NewTask,
	type Task as TaskType,
	type Task,
} from "~/server/db/schema";
import { taskSchema } from "~/entities/task-entity";
import { zodResolver } from "@hookform/resolvers/zod";
import type { UseMutationResult } from "@tanstack/react-query";
import type { UpdateTask } from "~/components/page/backlog/tasks";
import { type Action } from "~/utils/action";

// components
import Property from "~/components/task/property/property";
import TaskDropDownMenu from "~/components/task/task-dropdown-menu";

type Props = {
	task: TaskType;
	assignees: User[];
	addTaskMutation: UseMutationResult<
		Action<Task>,
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
};

const BoardTask = ({
	task,
	assignees,
	addTaskMutation,
	deleteTaskMutation,
}: Props) => {
	const form = useForm<Task>({
		resolver: zodResolver(taskSchema),
		defaultValues: { ...task },
	});

	useEffect(() => {
		form.reset({ ...task });
	}, [JSON.stringify(task)]);

	const order = [
		[{ key: "title", size: "default" }],
		[
			{ key: "status", size: "deafault" },
			{ key: "priority", size: "deafault" },
			{ key: "type", size: "default" },
			{ key: "assignee", size: "deafault" },
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
			<div key={groupIdx} className="flex flex-wrap items-center gap-2">
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
			<div className="my-2 flex flex-col gap-2 overflow-hidden rounded-lg border bg-background p-4 hover:bg-accent/25">
				{renderProperties()}
			</div>
		</TaskDropDownMenu>
	);
};

export default BoardTask;
