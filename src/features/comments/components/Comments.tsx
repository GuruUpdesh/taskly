"use client";

import React, { useEffect } from "react";

import { AnimatePresence } from "framer-motion";

import { type User } from "~/server/db/schema";

import CommentForm from "./CommentForm";
import UserComment, { type CommentWithUser } from "./UserComment";

type Props = {
	taskComments: CommentWithUser[];
	taskId: number;
	createComment: (comment: string, taskId: number) => Promise<void>;
};

interface CommentGroup {
	userId: string;
	user: User;
	comments: CommentWithUser[];
}

const Comments = ({ taskComments, taskId, createComment }: Props) => {
	const [comments, setComments] = React.useState(taskComments);

	// Group comments by user
	const groupedComments = comments.reduce(
		(groups: CommentGroup[], comment) => {
			const lastGroup = groups[groups.length - 1];

			if (lastGroup && lastGroup.userId === comment.userId) {
				lastGroup.comments.push(comment);
			} else {
				groups.push({
					userId: comment.userId,
					user: comment.user,
					comments: [comment],
				});
			}

			return groups;
		},
		[],
	);

	const deleteComment = (commentId: number) => {
		setComments((prevComments) => {
			return prevComments.filter((comment) => comment.id !== commentId);
		});
	};

	useEffect(() => {
		setComments(taskComments);
	}, [taskComments]);

	return (
		<>
			<div className="flex flex-col">
				<AnimatePresence initial={false}>
					{groupedComments.map((group, groupIndex) => (
						<div
							key={`group-${group.userId}-${groupIndex}`}
							className="mb-8"
						>
							{group.comments.map((comment, commentIndex) => (
								<UserComment
									key={comment.id}
									comment={comment}
									optimisticDeleteComment={deleteComment}
									taskId={taskId}
									isLastComment={
										groupIndex ===
											groupedComments.length - 1 &&
										commentIndex ===
											group.comments.length - 1
									}
									isLastInGroup={
										commentIndex ===
										group.comments.length - 1
									}
								/>
							))}
						</div>
					))}
				</AnimatePresence>
			</div>
			<CommentForm taskId={taskId} createComment={createComment} />
		</>
	);
};

export default Comments;
