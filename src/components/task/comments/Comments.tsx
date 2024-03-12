import React, { useEffect } from "react";

import { AnimatePresence } from "framer-motion";

import CommentForm from "./CommentForm";
import UserComment, { type CommentWithUser } from "./UserComment";

type Props = {
	taskComments: CommentWithUser[];
	taskId: number;
};

const Comments = ({ taskComments, taskId }: Props) => {
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
		<section className="comments-container mb-3 flex max-w-full flex-grow flex-col gap-4 overflow-scroll px-6 pb-1 pt-4">
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
			<CommentForm taskId={taskId} />
		</section>
	);
};

export default Comments;
