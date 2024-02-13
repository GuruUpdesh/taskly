import { auth } from "@clerk/nextjs";
import React from "react";
import { getMostRecentTasks } from "~/actions/task-views-actions";
import { cn } from "~/lib/utils";
import { Task } from "~/server/db/schema";
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "~/components/ui/tooltip";
import { getStatusDisplayName } from "~/entities/task-entity";
import Link from "next/link";

const RecentTasks = async () => {
	const { userId } = auth();
	if (!userId) return null;

	const mostRecentTasks = await getMostRecentTasks(userId, 5);
	console.log(mostRecentTasks);
	return (
		<ul>
			{mostRecentTasks.map((task) => (
				<Link
					key={task.id}
					href={`/project/${task.projectId}/task/${task.id}`}
				>
					<li className="flex items-center justify-between gap-1 rounded-full p-1 px-4 hover:bg-muted">
						<div className="flex items-center gap-1">
							<TaskStatus status={task.status} />
							{task.title}
						</div>
						<p className="text-xs capitalize text-muted-foreground">
							{task.category} recently
						</p>
					</li>
				</Link>
			))}
		</ul>
	);
};

type Props = {
	status: Task["status"];
};

const TaskStatus = ({ status }: Props) => {
	return (
		<TooltipProvider>
			<Tooltip>
				<TooltipTrigger asChild>
					<div
						className={cn("h-1 rounded-full border p-1", {
							"border-grey-600 bg-muted": status === "todo",
							"border-blue-500 bg-blue-600":
								status === "inprogress",
							"border-green-500 bg-green-600": status === "done",
						})}
					/>
				</TooltipTrigger>
				<TooltipContent>{getStatusDisplayName(status)}</TooltipContent>
			</Tooltip>
		</TooltipProvider>
	);
};

export default RecentTasks;
