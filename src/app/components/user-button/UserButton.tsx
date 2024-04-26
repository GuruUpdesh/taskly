import React from "react";

import { auth } from "@clerk/nextjs/server";
import { DotsVerticalIcon } from "@radix-ui/react-icons";
import { toast } from "sonner";

import { getUser } from "~/actions/user-actions";
import UserProfilePicture from "~/app/components/UserProfilePicture";
import { Button } from "~/components/ui/button";
import { cn } from "~/lib/utils";

import UserMenu from "./UserMenu";

type Props = {
	size?: "icon" | "large" | "default";
};

const UserButton = async ({ size = "default" }: Props) => {
	const { userId } = auth();

	if (!userId) {
		toast.error(
			"You cannot access this component without being signed in.",
		);
		return null;
	}

	const user = await getUser(userId);
	if (!user) {
		toast.error("Error loading user data");
		return null;
	}

	if (size === "large") {
		return (
			<div className="flex items-center justify-between rounded-md bg-accent/25 px-2 py-2">
				<div className="flex items-center gap-2">
					<UserProfilePicture src={user.profilePicture} size={30} />
					<h4 className={"text-lg font-semibold"}>{user.username}</h4>
				</div>
				<UserMenu>
					<Button
						variant="ghost"
						size="iconSm"
						className="h-[30px] w-[30px]"
					>
						<DotsVerticalIcon />
					</Button>
				</UserMenu>
			</div>
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
				<UserProfilePicture src={user.profilePicture} size={30} />
			</Button>
		</UserMenu>
	);
};

export default UserButton;
