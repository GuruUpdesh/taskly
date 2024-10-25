"use client";

import React, { useEffect, useRef } from "react";

import { useUser } from "@clerk/clerk-react";
import { DotsHorizontalIcon } from "@radix-ui/react-icons";
import { useQueryClient } from "@tanstack/react-query";
import { formatDistanceToNow } from "date-fns";
import { motion } from "framer-motion";
import { Trash, Trash2Icon } from "lucide-react";
import { toast } from "sonner";

import { deleteComment } from "~/actions/application/comment-actions";
import UserProfilePicture from "~/app/components/UserProfilePicture";
import { Button } from "~/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { cn } from "~/lib/utils";
import { type Comment, type User } from "~/server/db/schema";
import { useRealtimeStore } from "~/store/realtime";

import getHTMLfromJSON from "../editor/getHTMLfromJSON";

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
	const assignees = useRealtimeStore((state) => state.assignees);

	useEffect(() => {
		if (isLastComment && commentRef.current) {
			// Assuming the closest parent with a scrollbar is identified by the class 'comments-container'
			const scrollableContainer = commentRef.current.closest(
				".comments-container",
			);

			if (scrollableContainer) {
				// Directly scroll to the bottom of the container
				const scrollPosition = scrollableContainer.scrollHeight;

				setTimeout(() => {
					scrollableContainer.scrollTo({
						top: scrollPosition,
						behavior: "smooth",
					});
				}, 300);
			}
		}
	}, [isLastComment, commentRef.current]);

	const queryClient = useQueryClient();
	async function handleDelete() {
		await queryClient.cancelQueries({ queryKey: ["task", taskId] });
		if (comment.userId !== user?.id) return;
		optimisticDeleteComment(comment.id);
		await deleteComment(comment.id);
		toast.error("Comment deleted", {
			icon: <Trash className="h-4 w-4" />,
		});
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
					"relative mb-2 overflow-hidden text-wrap rounded-lg border bg-background/50 p-4 py-2",
					{
						"mb-0": isLastComment,
					},
				)}
				ref={commentRef}
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
									</DropdownMenuItem>
								</DropdownMenuContent>
							</DropdownMenu>
						) : null}
					</div>
				</div>
				<div
					className="tiptap mt-2 break-words text-sm leading-6"
					dangerouslySetInnerHTML={{
						__html: getHTMLfromJSON(comment.comment, assignees),
					}}
				></div>
			</div>
		</motion.div>
	);
};

export default UserComment;
