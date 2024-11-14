"use client";
import React, { useMemo } from "react";

import { GitHubLogoIcon } from "@radix-ui/react-icons";
import { useShallow } from "zustand/react/shallow";

import UserProfilePicture from "~/components/UserProfilePicture";
import {
	type TaskProperty as TaskPropertyType,
	getPropertyConfig,
} from "~/features/tasks/config/taskConfigType";
import { type TaskHistory, type User } from "~/server/db/schema";
import { useRealtimeStore } from "~/store/realtime";

import PropertyBadge from "./property/PropertyBadge";
import { formatDateRelative } from "../../../utils/formatDateRelative";

export interface TaskHistoryWithUser extends TaskHistory {
	user: User;
}

type Props = {
	history: TaskHistoryWithUser;
};

const TaskHistoryItem = ({ history }: Props) => {
	const [assignees, sprints] = useRealtimeStore(
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

	const { newOption, oldOption } = useMemo(() => {
		if (!config || (config.type !== "enum" && config.type !== "dynamic")) {
			return { newOption: null, oldOption: null };
		}
		return {
			newOption: config.options.find(
				(option) => option.key === history.propertyValue,
			),
			oldOption: config.options.find(
				(option) => option.key === history.oldPropertyValue,
			),
		};
	}, [config, history.propertyValue, history.oldPropertyValue]);

	if (!config || !newOption) return null;

	const isGitHub = history.userId === "github";

	return (
		<div className="group relative flex items-start gap-4 py-2">
			{/* Timeline and Icon */}
			<div className="">
				<div className="absolute left-4 top-0 -z-10 h-[120%] w-[2px] -translate-x-1/2 bg-border" />
				<div className="bg-[#151515] py-2">
					<PropertyBadge
						option={newOption}
						size="iconSm"
						className="z-10"
					/>
				</div>
			</div>

			{/* Content */}
			<div className="flex-1 space-y-1 pt-1">
				<div className="w-16 whitespace-nowrap pt-0.5 text-sm text-muted-foreground">
					{formatDateRelative(history.insertedDate)}
				</div>
				<div className="text-base text-foreground">
					{history.comment ? (
						history.comment
					) : (
						<>
							{config.displayName} changed from{" "}
							<span className="rounded-xl bg-accent px-2 font-medium">
								{oldOption?.displayName}
							</span>
							{" to "}
							<span className="rounded-xl bg-accent px-2 font-medium">
								{newOption.displayName}
							</span>
						</>
					)}
				</div>

				{/* Additional Info */}
				<div className="mt-0.5 flex items-center gap-2 text-sm text-muted-foreground">
					{isGitHub ? (
						<div className="flex items-center gap-1">
							<GitHubLogoIcon className="h-4 w-4" />
							<span>GitHub</span>
						</div>
					) : (
						<div className="flex items-center gap-2">
							<UserProfilePicture
								src={history.user.profilePicture}
							/>
							<span>{history.user.username}</span>
						</div>
					)}
				</div>
			</div>
		</div>
	);
};

export default TaskHistoryItem;
