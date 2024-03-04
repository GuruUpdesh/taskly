"use client";

import React, { useMemo } from "react";

import { formatDistanceToNow } from "date-fns";
import { useShallow } from "zustand/react/shallow";

import {
	getPropertyConfig,
	type TaskProperty as TaskPropertyType,
} from "~/config/TaskConfigType";
import { useAppStore } from "~/store/app";

import { type CommentWithUser } from "./Comment";
import UserProfilePicture from "../user-profile-picture";

type Props = {
	comment: CommentWithUser;
};

const UserComment = ({ comment }: Props) => {
	const [assignees, sprints] = useAppStore(
		useShallow((state) => [state.assignees, state.sprints]),
	);

	const userOption = useMemo(() => {
		const config = getPropertyConfig(
			comment.propertyKey as TaskPropertyType,
			assignees,
			sprints,
		);

		if (!config) return null;
		if (config.type !== "enum" && config.type !== "dynamic") return null;

		return config.options.find(
			(option) => option.key === comment.propertyValue,
		);
	}, [comment.user.username]);

	if (!userOption) {
		return null;
	}

	return (
		<div className="flex-1rounded-lg rounded-lg border bg-accent/25 p-4 hover:bg-accent/35">
			<div className="flex items-center justify-between gap-2 border-b pb-2 text-sm">
				<div className="flex items-center gap-2">
					<UserProfilePicture
						src={comment.user.profilePicture}
						size={25}
					/>
					<p className="pb-1 font-bold">{comment.user.username}</p>
				</div>
				<p className="whitespace-nowrap">
					{formatDistanceToNow(comment.insertedDate)}
				</p>
			</div>
			<p className="mt-2 text-sm leading-6">{comment.comment}</p>
		</div>
	);
};

export default UserComment;
