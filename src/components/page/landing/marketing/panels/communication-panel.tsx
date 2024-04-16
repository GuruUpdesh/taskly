"use client";

import React from "react";

import { subMinutes } from "date-fns";

import Comments from "~/components/task/comments/Comments";
import { AnimatePresence } from "framer-motion";
import UserComment from "~/components/task/comments/UserComment";

const initialComments = [
	{
		id: 1,
		comment:
			"Hey team, I've added a new task to the backlog for implementing user authentication. Who's available to take this on?",
		taskId: 1,
		userId: "1",
		insertedDate: subMinutes(new Date(), 15),
		user: {
			userId: "1",
			username: "Jordan Lee",
			profilePicture: "/static/profiles/p3.png",
		},
	},
	{
		id: 2,
		comment:
			"I can work on it! I've got some experience with authentication systems.",
		taskId: 1,
		userId: "2",
		insertedDate: subMinutes(new Date(), 10),
		user: {
			userId: "2",
			username: "Alex Smith",
			profilePicture: "/static/profiles/p1.png",
		},
	},
	{
		id: 3,
		comment:
			"Great! Feel free to reach out if you need any help or guidance.",
		taskId: 1,
		userId: "3",
		insertedDate: subMinutes(new Date(), 5),
		user: {
			userId: "3",
			username: "Casey Johnson",
			profilePicture: "/static/profiles/p2.png",
		},
	},
];

const addedComment = {
	id: 4,
	comment: "Thanks, Casey! I'll keep you updated on my progress.",
	taskId: 1,
	userId: "2",
	insertedDate: new Date(),
	user: {
		userId: "2",
		username: "Alex Smith",
		profilePicture: "/static/profiles/p1.png",
	},
};

const CommunicationPanel = () => {
	const [comments, setComments] = React.useState(initialComments);
	const [added, setAdded] = React.useState(false);

	function onHover() {
		if (added) {
			return;
		}
		setComments((prevComments) => {
			return [...prevComments, addedComment];
		});
		setAdded(true);
	}

	function onLeave() {
		setComments(initialComments);
		setAdded(false);
	}

	return (
		<div
			className="comments-container flex max-h-[564px] max-w-full flex-grow flex-col gap-4 overflow-hidden mix-blend-overlay"
			onMouseEnter={onHover}
			onMouseLeave={onLeave}
		>
			<div className="flex flex-col">
				<AnimatePresence initial={false}>
					{comments.map((comment, index) => {
						return (
							<UserComment
								key={comment.id}
								comment={comment}
								isLastComment={index === comments.length - 1}
								taskId={1}
							/>
						);
					})}
				</AnimatePresence>
			</div>
		</div>
	);
};

export default CommunicationPanel;
