"use client";

import React from "react";

import { useUser } from "@clerk/nextjs";
import { DotsVerticalIcon } from "@radix-ui/react-icons";

import { Button } from "~/components/ui/button";
import UserProfilePicture from "~/components/UserProfilePicture";

import UserMenu from "./UserMenu";
import { Skeleton } from "../ui/skeleton";

type Props = {
	size?: "icon" | "large" | "default";
};

const UserButton = ({ size = "default" }: Props) => {
	const { user } = useUser();

	if (!user) {
		return <Skeleton className="h-[52px] rounded-xl" />;
	}

	if (size === "large") {
		return (
			<UserMenu>
				<div className="z-10 flex min-w-full items-center justify-between rounded-xl bg-foreground/5 p-2">
					<div className="flex min-w-0 flex-grow items-center gap-2">
						<UserProfilePicture src={user.imageUrl} size={36} />
						<div className="truncate">
							<p className="truncate overflow-ellipsis text-sm capitalize">
								{user.fullName ? user.fullName : user.username}
							</p>
							<p className="truncate overflow-ellipsis text-xs text-muted-foreground">
								{user.primaryEmailAddress?.emailAddress}
							</p>
						</div>
					</div>
					<Button
						variant="ghost"
						size="iconSm"
						className="h-[30px] w-[30px] flex-shrink-0"
					>
						<DotsVerticalIcon />
					</Button>
				</div>
			</UserMenu>
		);
	}

	return (
		<UserMenu>
			<Button variant="ghost" size="icon" className="min-w-[30px]">
				<UserProfilePicture src={user.imageUrl} size={30} />
			</Button>
		</UserMenu>
	);
};

export default UserButton;
