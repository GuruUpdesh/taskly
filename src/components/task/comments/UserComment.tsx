"use client";

import React, { useEffect, useRef } from "react";

import { useUser } from "@clerk/clerk-react";
import { DotsHorizontalIcon } from "@radix-ui/react-icons";
import { useQueryClient } from "@tanstack/react-query";
import { formatDistanceToNow } from "date-fns";
import { motion } from "framer-motion";
import { Trash2Icon } from "lucide-react";

import { deleteComment } from "~/actions/application/comment-actions";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuShortcut,
	DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { cn } from "~/lib/utils";
import { type Comment, type User } from "~/server/db/schema";

import { Button } from "../../ui/button";
import UserProfilePicture from "../../user-profile-picture";

export interface CommentWithUser extends Comment {
	user: User;
}

type Props = {
	comment: CommentWithUser;
	isLastComment: boolean;
	optimisticDeleteComment: (commentId: number) => void;
	taskId: number;
};

const UserComment = ({
	comment,
	isLastComment,
	optimisticDeleteComment,
	taskId,
}: Props) => {
	const { user } = useUser();
	const commentRef = useRef<HTMLDivElement | null>(null);

	useEffect(() => {
		if (isLastComment && commentRef.current) {
			// Assuming the closest parent with a scrollbar is identified by the class 'comments-container'
			const scrollableContainer = commentRef.current.closest(
				".comments-container",
			);

			if (scrollableContainer) {
				// Directly scroll to the bottom of the container
				const scrollPosition = scrollableContainer.scrollHeight;

				scrollableContainer.scrollTo({
					top: scrollPosition,
					behavior: "smooth",
				});
			}
		}
	}, [isLastComment, commentRef.current]);

	const queryClient = useQueryClient();
	async function handleDelete() {
		await queryClient.cancelQueries({ queryKey: ["task", taskId] });
		if (comment.userId !== user?.id) return;
		optimisticDeleteComment(comment.id);
		await deleteComment(comment.id);
	}

	return (
		<motion.div
			initial={{ height: 0, opacity: 0 }}
			exit={{
				height: 0,
				opacity: 0,
				transition: {
					duration: 0.5,
					type: "spring",
					bounce: 0.3,
				},
			}}
			animate={{ height: "auto", opacity: 1 }}
		>
			<div
				className={cn(
					"relative mb-4 rounded-lg border bg-accent/25 p-4 hover:bg-accent/35",
					{
						"mb-0": isLastComment,
					},
				)}
				ref={commentRef}
			>
				<div className="flex items-center justify-between gap-2 border-b pb-2 text-sm">
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
							{formatDistanceToNow(comment.insertedDate)}
						</p>
						{comment.userId === user?.id ? (
							<DropdownMenu>
								<DropdownMenuTrigger asChild>
									<Button variant="ghost" size="icon">
										<DotsHorizontalIcon />
									</Button>
								</DropdownMenuTrigger>
								<DropdownMenuContent
									className="w-56 bg-background/75 p-2 backdrop-blur-lg"
									onCloseAutoFocus={(e) => e.preventDefault()}
									align="start"
								>
									<DropdownMenuItem onClick={handleDelete}>
										<Trash2Icon className="mr-2 h-4 w-4" />
										Delete
										<DropdownMenuShortcut>
											d
										</DropdownMenuShortcut>
									</DropdownMenuItem>
								</DropdownMenuContent>
							</DropdownMenu>
						) : null}
					</div>
				</div>
				<p className="mt-2 text-sm leading-6">{comment.comment}</p>
			</div>
		</motion.div>
	);
};

export default UserComment;
