import React from "react";
import { getMostRecentTasks } from "~/actions/application/task-views-actions";
import { cn } from "~/lib/utils";
import { type Task as TaskType } from "~/server/db/schema";
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "~/components/ui/tooltip";
import { getStatusDisplayName } from "~/config/task-entity";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { Label } from "~/components/ui/label";
import { getEnumOptionByKey } from "~/config/TaskConfigType";
import TaskProperty from "~/components/task/TaskProperty";

export function RecentTasksNavWrapper() {
	return (
		<div>
			<Label className="whitespace-nowrap font-bold">Recent Tasks</Label>
			<RecentTasks />
		</div>
	);
}

type RecentTasksProps = {
	number?: number;
};

const RecentTasks = async ({ number }: RecentTasksProps) => {
	const mostRecentTasks = await getMostRecentTasks(number);
	if (mostRecentTasks.length === 0) return null;

	return (
		<ul>
			{mostRecentTasks.map((task) => (
				<Link
					key={task.id}
					href={`/project/${task.projectId}/task/${task.id}`}
				>
					<li className="group flex items-center justify-between gap-1 rounded-full p-1 px-4 hover:bg-muted">
						<div className="flex items-center gap-1">
							<TaskStatus status={task.status} />
							{task.title}
						</div>
						<p className="text-xs capitalize text-muted-foreground">
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
			className={cn("group-hover:shadow-lg", {
				"group-hover:border-background": status === "backlog",
			})}
			hover="group"
		/>
	);
};

export default RecentTasks;
