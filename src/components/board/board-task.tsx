/* eslint-disable @typescript-eslint/no-unsafe-member-access */
"use client";

import React, { useEffect } from "react";
import {
	type User,
	type NewTask,
	type Task as TaskType,
	type Sprint,
} from "~/server/db/schema";
import Property from "~/components/backlog/task/property/property";
import { taskSchema } from "~/config/task-entity";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { UseMutationResult } from "@tanstack/react-query";
import type { UpdateTask } from "~/components/backlog/tasks";
import TaskDropDownMenu from "~/components/backlog/task/task-dropdown-menu";

type Props = {
	task: TaskType;
	assignees: User[];
	sprints: Sprint[];
	addTaskMutation: UseMutationResult<void, Error, UpdateTask, unknown>;
	deleteTaskMutation: UseMutationResult<void, Error, number, unknown>;
};

const BoardTask = ({
	task,
	assignees,
	sprints,
	addTaskMutation,
	deleteTaskMutation,
}: Props) => {
	const form = useForm<NewTask>({
		resolver: zodResolver(taskSchema),
		defaultValues: { ...task },
	});

	useEffect(() => {
		form.reset({ ...task });
	}, [JSON.stringify(task)]);

	const order = [
		[{ key: "title", size: "default" }],
		[
			{ key: "status", size: "icon" },
			{ key: "priority", size: "icon" },
			{ key: "type", size: "icon" },
			{ key: "assignee", size: "icon" },
			{ key: "sprintId", size: "icon" },
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
							sprints={sprints}
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
