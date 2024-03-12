"use client";

import React, { useEffect, useRef, useState } from "react";

import type { ControllerRenderProps } from "react-hook-form";

import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { Textarea } from "~/components/ui/textarea";
import UserProfilePicture from "~/components/user-profile-picture";
import { type User } from "~/server/db/schema";

function TextAreaWithMentions({
	assignees,
	field,
}: {
	assignees: User[];
	field: ControllerRenderProps<{ comment: string }, "comment">;
}) {
	const [displayedComment, setDisplayedComment] = useState(field.value);
	useEffect(() => {
		if (field.value === "" && displayedComment !== field.value) {
			setDisplayedComment("");
		}
	}, [field.value]);

	useEffect(() => {
		const mentions = displayedComment.match(/@\w+\s*/g);
		let value = displayedComment;
		for (const mention of mentions ?? []) {
			const username = mention.replace("@", "").trim();
			const user = assignees.find((user) => user.username === username);
			if (user) {
				value = value.replaceAll(
					mention,
					`@[${user.username}](${user.userId})`,
				);
			}
		}
		field.onChange(value);
	}, [displayedComment]);

	const [open, setOpen] = useState(false);
	const textareaRef = useRef<HTMLTextAreaElement | null>(null);

	const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
		if (e.key === "@") {
			setDisplayedComment(displayedComment + "@");
			setOpen(true);
		} else if (e.key === "Escape") {
			setOpen(false);
		}
	};

	const handleUserClick = (user: User) => {
		setDisplayedComment(displayedComment + `${user.username}`);
		setOpen(false);
	};

	return (
		<DropdownMenu
			open={open}
			onOpenChange={(open) => {
				if (!open) {
					setOpen(false);
				}
			}}
		>
			<div className="relative">
				<Textarea
					placeholder="Add a comment..."
					className="resize-none bg-accent/25"
					rows={2}
					ref={textareaRef}
					onKeyDown={handleKeyDown}
					onChange={(e) => {
						const value = e.target.value;
						setDisplayedComment(value);
					}}
					value={displayedComment}
					data-value={field.value}
				/>
				<DropdownMenuTrigger asChild>
					<div className="absolute top-0 -z-10 h-full w-full"></div>
				</DropdownMenuTrigger>
			</div>
			<DropdownMenuContent
				className="bg-background/75 p-1 backdrop-blur-lg"
				style={{
					width: `${textareaRef.current?.clientWidth}px`,
				}}
				align="start"
				onCloseAutoFocus={(e) => {
					e.preventDefault();
					textareaRef.current?.focus();
				}}
			>
				{assignees.map((user, idx) => (
					<DropdownMenuItem
						key={idx}
						onClick={() => handleUserClick(user)}
						className="flex w-full items-center justify-start gap-2"
					>
						<UserProfilePicture src={user.profilePicture} />
						{user.username}
					</DropdownMenuItem>
				))}
			</DropdownMenuContent>
		</DropdownMenu>
	);
}

export default TextAreaWithMentions;
