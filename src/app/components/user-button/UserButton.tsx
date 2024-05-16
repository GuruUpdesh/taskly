"use client";

import React from "react";

import { useUser } from "@clerk/nextjs";
import { DotsVerticalIcon } from "@radix-ui/react-icons";

import UserProfilePicture from "~/app/components/UserProfilePicture";
import { Button } from "~/components/ui/button";
import { cn } from "~/lib/utils";

import UserMenu from "./UserMenu";
import SimpleTooltip from "../SimpleTooltip";

type Props = {
	size?: "icon" | "large" | "default";
};

const UserButton = ({ size = "default" }: Props) => {
	const { user } = useUser();

	if (!user) {
		return null;
	}

	if (size === "large") {
		return (
			<UserMenu>
				<div className="z-10 flex min-w-full items-center justify-between rounded-md border-b bg-[#111111] px-2 py-2">
					<div className="flex min-w-0 flex-grow items-center gap-2">
						<UserProfilePicture src={user.imageUrl} size={30} />
						<SimpleTooltip
							label={user.username ? user.username : ""}
						>
							<h4 className="max-w-full truncate overflow-ellipsis whitespace-nowrap text-lg font-semibold">
								{user.username}
							</h4>
						</SimpleTooltip>
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
			<Button
				variant="ghost"
				size="icon"
				className={cn("min-w-[30px]", {
					"rounded-full": size === "icon",
				})}
			>
				<UserProfilePicture src={user.imageUrl} size={30} />
			</Button>
		</UserMenu>
	);
};

export default UserButton;
