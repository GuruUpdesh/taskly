"use client";

import React, { useMemo } from "react";

import { GitHubLogoIcon } from "@radix-ui/react-icons";
import { format, formatDistanceToNow } from "date-fns";
import { Dot } from "lucide-react";
import { useShallow } from "zustand/react/shallow";

import SimpleTooltip from "~/app/components/SimpleTooltip";
import {
	type TaskProperty as TaskPropertyType,
	getPropertyConfig,
} from "~/config/taskConfigType";
import { cn } from "~/lib/utils";
import { type TaskHistory, type User } from "~/server/db/schema";
import { useAppStore } from "~/store/app";
import typography from "~/styles/typography";

import TaskProperty from "./TaskProperty";
export interface TaskHistoryWithUser extends TaskHistory {
	user: User;
}

type Props = {
	history: TaskHistoryWithUser;
};

const TaskHistoryItem = ({ history }: Props) => {
	const [assignees, sprints] = useAppStore(
		useShallow((state) => [state.assignees, state.sprints]),
	);

	const config = useMemo(
		() =>
			getPropertyConfig(
				history.propertyKey as TaskPropertyType,
				assignees,
				sprints,
			),
		[history.propertyKey, assignees, sprints],
	);

	const newOption = useMemo(() => {
		if (!config) return null;
		if (config.type !== "enum" && config.type !== "dynamic") return null;

		const options = config.options;
		return options.find((option) => option.key === history.propertyValue);
	}, [config, history.propertyValue]);

	const oldOption = useMemo(() => {
		if (!config) return null;
		if (config.type !== "enum" && config.type !== "dynamic") return null;

		const options = config.options;
		return options.find(
			(option) => option.key === history.oldPropertyValue,
		);
	}, [config, history.oldPropertyValue]);

	if (!config || !newOption) {
		return null;
	}

	return (
		<div
			className={cn(
				"flex items-center text-sm",
				typography.paragraph.p_muted,
			)}
		>
			<div className="relative">
				<TaskProperty option={newOption} size="iconSm" />
				<div className="absolute left-0 top-0 -z-10 h-full w-full bg-background" />
				<div className="absolute left-[50%] -z-20 h-[200%] w-[1px] -translate-x-[50%] bg-muted" />
			</div>
			{!oldOption || history.comment ? (
				<p className="ml-3">
					{history.userId === "github" ? (
						<b className="inline-flex items-baseline gap-1 text-foreground">
							<GitHubLogoIcon className="h-4 w-4 translate-y-0.5" />{" "}
							GitHub
						</b>
					) : (
						<b className="text-foreground">
							{history.user.username}
						</b>
					)}{" "}
					{history.comment}
				</p>
			) : (
				<p className="ml-3">
					{history.userId === "github" ? (
						<b className="inline-flex items-baseline gap-1 text-foreground">
							<GitHubLogoIcon className="h-4 w-4 translate-y-0.5" />{" "}
							GitHub
						</b>
					) : (
						<b className="text-foreground">
							{history.user.username}
						</b>
					)}{" "}
					changed {config.displayName} from{" "}
					<b className="text-foreground">{oldOption.displayName}</b>{" "}
					to{" "}
					<b className="text-foreground">{newOption.displayName}</b>
				</p>
			)}
			<Dot />
			<SimpleTooltip
				label={format(history.insertedDate, "MMM dd, yyyy, h:mm:ss aa")}
			>
				<p className="whitespace-nowrap transition-colors hover:text-foreground">
					{formatDistanceToNow(history.insertedDate)}
				</p>
			</SimpleTooltip>
		</div>
	);
};

export default TaskHistoryItem;
