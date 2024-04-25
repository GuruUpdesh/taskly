"use client";

import React from "react";

import { MailCheck } from "lucide-react";

import {
	deleteAllNotifications,
	readAllNotifications,
} from "~/actions/notification-actions";
import { Button } from "~/components/ui/button";
import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "~/components/ui/dialog";

import SimpleTooltip from "../../../../../components/SimpleTooltip";

type Props = {
	user: string;
};

export default function InboxButtons({ user }: Props) {
	async function markAllAsRead(userId: string) {
		await readAllNotifications(userId);
	}

	async function deleteNotificationsForUser(userId: string) {
		await deleteAllNotifications(userId);
	}

	return (
		<>
			<SimpleTooltip label="Mark all as Read">
				<Button
					variant="outline"
					onClick={() => markAllAsRead(user)}
					size="icon"
					className="bg-transparent"
				>
					<MailCheck className="h-4 w-4" />
				</Button>
			</SimpleTooltip>
			<Dialog>
				<DialogTrigger asChild>
					<Button
						variant="outline"
						className="whitespace-nowrap bg-transparent"
					>
						Delete All
					</Button>
				</DialogTrigger>
				<DialogContent className="sm:max-w-md">
					<DialogHeader>
						<DialogTitle>Delete All Notifications</DialogTitle>
						<DialogDescription>
							Warning, this can not be undone. Are you sure you
							want to delete all notifications?
						</DialogDescription>
					</DialogHeader>
					<div className="flex items-center space-x-2">
						<div className="grid flex-1 gap-2"></div>
					</div>
					<DialogFooter className="sm:justify-start">
						<DialogClose asChild>
							<Button type="button" variant="secondary">
								Cancel
							</Button>
						</DialogClose>
						<DialogClose asChild>
							<Button
								variant="destructive"
								onClick={() => deleteNotificationsForUser(user)}
							>
								Delete
							</Button>
						</DialogClose>
					</DialogFooter>
				</DialogContent>
			</Dialog>
		</>
	);
}
