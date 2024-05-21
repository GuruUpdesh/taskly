import React from "react";

import { formatDistanceToNow } from "date-fns";
import Link from "next/link";

import { getMostRecentTasks } from "~/actions/application/task-views-actions";
import TaskProperty from "~/app/(application)/project/[projectId]/task/[taskId]/components/TaskProperty";
import { getEnumOptionByKey } from "~/config/taskConfigType";
import { cn } from "~/lib/utils";
import { type Task as TaskType } from "~/server/db/schema";

type RecentTasksProps = {
	projectId: number;
	number?: number;
};

const RecentTasks = async ({ projectId, number }: RecentTasksProps) => {
	let mostRecentTasks = [];
	try {
		mostRecentTasks = await getMostRecentTasks(projectId, number);
	} catch (error) {
		console.error("Error fetching most recent tasks", error);
		return <p>You have no tasks yet!</p>;
	}

	if (mostRecentTasks.length === 0) return <p>You have no tasks yet!</p>;

	return (
		<ul>
			{mostRecentTasks.map((task) => (
				<Link
					key={task.id}
					href={`/project/${task.projectId}/task/${task.id}`}
				>
					<li className="group relative flex items-center justify-between gap-1 rounded p-1 hover:bg-muted">
						<div className="flex min-w-0 flex-1 items-center gap-1">
							<TaskStatus status={task.status} />
							<p className=" min-w-0 flex-shrink overflow-hidden overflow-ellipsis whitespace-nowrap">
								{task.title}
							</p>
						</div>
						<p className="flex-shrink-0 whitespace-nowrap text-xs capitalize text-muted-foreground">
							{task.category}{" "}
							{formatDistanceToNow(
								task.categoryTimestamp ?? new Date(),
							)}{" "}
							ago
						</p>
					</li>
				</Link>
			))}
		</ul>
	);
};

type Props = {
	status: TaskType["status"];
};

export const TaskStatus = ({ status }: Props) => {
	const option = getEnumOptionByKey(status);
	if (!option) return null;

	return (
		<TaskProperty
			option={option}
			size="iconSm"
			className={cn("aspect-square group-hover:shadow-lg", {
				"group-hover:border-background": status === "backlog",
			})}
			hover="group"
		/>
	);
};

export default RecentTasks;
