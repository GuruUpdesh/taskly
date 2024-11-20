"use client";

import React, { useEffect, useRef } from "react";

import { useUser } from "@clerk/clerk-react";
import { useQueryClient } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Trash, Trash2Icon } from "lucide-react";
import { toast } from "sonner";

import SimpleTooltip from "~/components/SimpleTooltip";
import {
	ContextMenu,
	ContextMenuContent,
	ContextMenuItem,
	ContextMenuTrigger,
} from "~/components/ui/context-menu";
import UserProfilePicture from "~/components/UserProfilePicture";
import { deleteComment } from "~/features/comments/actions/delete-comment";
import { cn } from "~/lib/utils";
import { type Comment, type User } from "~/schema";
import { useRealtimeStore } from "~/store/realtime";
import { formatDateRelative, formatDateVerbose } from "~/utils/dateFormatters";

import getHTMLfromJSON from "../../text-editor/utils/getHTMLfromJSON";

export interface CommentWithUser extends Comment {
	user: User;
}

type Props = {
	comment: CommentWithUser;
	optimisticDeleteComment: (commentId: number) => void;
	taskId: number;
	isLastComment: boolean;
	isLastInGroup: boolean;
};

const UserComment = ({
	comment,
	optimisticDeleteComment,
	taskId,
	isLastComment,
	isLastInGroup,
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
				className={cn("flex items-end gap-2", {
					"flex-row-reverse": comment.userId === user?.id,
					"mb-0": isLastComment || !isLastInGroup,
					"mb-8": isLastInGroup,
				})}
			>
				{isLastInGroup ? (
					<SimpleTooltip label={comment.user.username}>
						<div className="mb-7">
							<UserProfilePicture
								src={comment.user.profilePicture}
								size={30}
							/>
						</div>
					</SimpleTooltip>
				) : (
					<div className="min-w-[30px]" />
				)}
				<ContextMenu>
					<ContextMenuTrigger disabled={comment.userId !== user?.id}>
						<div ref={commentRef}>
							<div
								className={cn(
									"mb-2 flex flex-col gap-1 rounded-xl bg-accent px-4 py-2",
									{
										"rounded-br-none":
											isLastInGroup &&
											comment.userId === user?.id,
										"rounded-bl-none":
											isLastInGroup &&
											comment.userId !== user?.id,
										"bg-background":
											comment.userId === user?.id,
									},
								)}
							>
								<div
									className="tiptap tiptap-static break-words text-sm leading-6"
									dangerouslySetInnerHTML={{
										__html: getHTMLfromJSON(
											comment.comment,
											assignees,
										),
									}}
								/>
							</div>
							{isLastInGroup && (
								<SimpleTooltip
									label={formatDateVerbose(
										comment.insertedDate,
									)}
								>
									<p
										className="w-max whitespace-nowrap px-4 text-xs text-muted-foreground"
										suppressHydrationWarning
									>
										{formatDateRelative(
											comment.insertedDate,
										)}
									</p>
								</SimpleTooltip>
							)}
						</div>
					</ContextMenuTrigger>
					<ContextMenuContent>
						<ContextMenuItem
							key="delete-comment"
							className="gap-2"
							onClick={handleDelete}
						>
							<Trash2Icon className="mr-2 h-4 w-4" />
							Delete
						</ContextMenuItem>
					</ContextMenuContent>
				</ContextMenu>
			</div>
		</motion.div>
	);
};

export default UserComment;
