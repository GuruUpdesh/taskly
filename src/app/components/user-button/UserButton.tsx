"use client";

import React from "react";

import { useUser } from "@clerk/nextjs";
import { DotsVerticalIcon } from "@radix-ui/react-icons";

import UserProfilePicture from "~/app/components/UserProfilePicture";
import { Button } from "~/components/ui/button";
import { cn } from "~/lib/utils";

import UserMenu from "./UserMenu";

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
				<div className="z-10 flex items-center justify-between rounded-md border-b bg-[#111111] px-2 py-2">
					<div className="flex items-center gap-2">
						<UserProfilePicture src={user.imageUrl} size={30} />
						<h4 className={"text-lg font-semibold"}>
							{user.username}
						</h4>
					</div>
					<Button
						variant="ghost"
						size="iconSm"
						className="h-[30px] w-[30px]"
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
