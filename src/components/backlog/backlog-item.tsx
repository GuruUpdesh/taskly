/* eslint-disable @typescript-eslint/no-unsafe-member-access */
"use client";

import React, { useEffect } from "react";
import { type NewTask, type Task } from "~/server/db/schema";
import Property from "./property/property";
import { taskSchema } from "~/entities/task-entity";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { UseMutationResult } from "@tanstack/react-query";
import type { UpdateTask } from "~/app/(application)/project/[projectId]/backlog/tasks";
import ItemDropDownMenu from "./item-dropdown-menu";

type Props = {
	task: Task;
	projectId: string;
	addTaskMutation: UseMutationResult<void, Error, UpdateTask, unknown>;
	deleteTaskMutation: UseMutationResult<void, Error, number, unknown>;
};

const BacklogItem = ({ task, projectId, addTaskMutation, deleteTaskMutation }: Props) => {
	const form = useForm<NewTask>({
		resolver: zodResolver(taskSchema),
		defaultValues: { ...task },
	});

	useEffect(() => {
		form.reset({ ...task });
	}, [JSON.stringify(task)]);

	const order = [
		["priority", "status", "title", "description"],
		["type"],
	] as (keyof Task)[][];

	function onSubmit(newTask: NewTask) {
		newTask.projectId = task.projectId;
		const changes = Object.keys(newTask).reduce((acc, key) => {
			if (newTask[key as keyof NewTask] !== task[key as keyof Task]) {
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
			<div key={groupIdx} className="flex items-center gap-2">
				{group.map((property, idx) => {
					if (property === "id" || property === "projectId")
						return null;
					return (
						<Property
							key={idx}
							property={property as keyof NewTask}
							form={form}
							onSubmit={onSubmit}
						/>
					);
				})}
			</div>
		));
	}

	return (
		<ItemDropDownMenu deleteTaskMutation={deleteTaskMutation} task={task}>
				{renderProperties()}
		</ItemDropDownMenu>
	);
};

export default BacklogItem;
