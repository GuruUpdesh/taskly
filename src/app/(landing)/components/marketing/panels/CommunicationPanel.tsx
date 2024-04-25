import React from "react";

import { formatDistanceToNow, subMinutes } from "date-fns";

import UserProfilePicture from "~/app/components/UserProfilePicture";
import { cn } from "~/lib/utils";

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
	{
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
	},
];

const CommunicationPanel = () => {
	return (
		<div className="comments-container ease-slow flex max-w-full flex-grow flex-col gap-4 overflow-hidden mix-blend-overlay transition-transform duration-500 group-hover:translate-y-[-104px]">
			<div className="flex flex-col">
				{initialComments.map((comment, index) => {
					const firstComment = index === 0;
					const lastComment = index === initialComments.length - 1;

					return (
						<div
							key={index}
							className={cn(
								"ease-slow relative mb-4 overflow-hidden text-wrap rounded-lg border bg-accent/50 p-4 py-2 transition-all duration-500 hover:bg-accent",
								{
									"scale-100 opacity-100 group-hover:scale-0 group-hover:opacity-0":
										firstComment,
									"scale-0 opacity-0 group-hover:scale-100 group-hover:opacity-100":
										lastComment,
								},
							)}
						>
							<div className="flex items-center justify-between gap-2 border-b pb-1 text-sm">
								<div className="flex items-center gap-2">
									<UserProfilePicture
										src={comment.user.profilePicture}
										size={25}
									/>
									<p className="pb-1 font-bold">
										{comment.user.username}
									</p>
								</div>
								<div className="flex items-center gap-2">
									<p
										className="whitespace-nowrap"
										suppressHydrationWarning
									>
										{formatDistanceToNow(
											comment.insertedDate,
										)}
									</p>
								</div>
							</div>
							<p className="mt-2 break-words text-sm leading-6">
								{comment.comment}
							</p>
						</div>
					);
				})}
			</div>
		</div>
	);
};

export default CommunicationPanel;
