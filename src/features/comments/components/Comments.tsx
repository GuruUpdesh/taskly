"use client";

import React, { useEffect } from "react";

import { AnimatePresence } from "framer-motion";

import CommentForm from "./CommentForm";
import UserComment, { type CommentWithUser } from "./UserComment";

type Props = {
	taskComments: CommentWithUser[];
	taskId: number;
	createComment: (comment: string, taskId: number) => Promise<void>;
};

const Comments = ({ taskComments, taskId, createComment }: Props) => {
	const [comments, setComments] = React.useState(taskComments);

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
					{comments.map((comment, index) => {
						return (
							<UserComment
								key={comment.id}
								comment={comment}
								isLastComment={index === comments.length - 1}
								optimisticDeleteComment={deleteComment}
								taskId={taskId}
							/>
						);
					})}
				</AnimatePresence>
			</div>
			<CommentForm taskId={taskId} createComment={createComment} />
		</>
	);
};

export default Comments;
