"use client";

import React from "react";

import { DotsVerticalIcon } from "@radix-ui/react-icons";

import { Button } from "~/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { readAllNotifications } from "~/features/notifications/actions/notification-actions";

type Props = {
	user: string;
};

export default function InboxButtons({ user }: Props) {
	async function markAllAsRead(userId: string) {
		await readAllNotifications(userId);
	}

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button
					variant="outline"
					size="icon"
					className="h-[36px] w-[36px] rounded-xl bg-background-dialog"
				>
					<DotsVerticalIcon />
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent>
				<DropdownMenuItem onClick={() => markAllAsRead(user)}>
					Mark All Read
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
