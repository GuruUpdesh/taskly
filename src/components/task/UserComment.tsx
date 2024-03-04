"use client";

import React, { useMemo } from "react";

import { formatDistanceToNow } from "date-fns";
import { useShallow } from "zustand/react/shallow";

import {
	getPropertyConfig,
	type TaskProperty as TaskPropertyType,
} from "~/config/TaskConfigType";
import { useAppStore } from "~/store/app";
import UserProfilePicture from "../user-profile-picture";
import { Comment, User } from "~/server/db/schema";

export interface CommentsWithUser extends Comment {
	user: User;
}

type Props = {
	comment: CommentsWithUser;
};

const UserComment = ({ comment }: Props) => {

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
