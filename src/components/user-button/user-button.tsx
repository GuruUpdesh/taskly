import React from "react";

import { auth } from "@clerk/nextjs";
import { ChevronDown } from "lucide-react";
import { toast } from "sonner";

import { getUser } from "~/actions/user-actions";
import { Button } from "~/components/ui/button";
import UserProfilePicture from "~/components/user-profile-picture";
import { cn } from "~/lib/utils";

import UserMenu from "./user-menu";

type Props = {
	variant: "landing" | "application";
};

const UserButton = async ({ variant }: Props) => {
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

	return (
		<UserMenu>
			<Button
				variant="ghost"
				size="icon"
				className={cn({
					"min-w-[30px]": variant === "application",
				})}
			>
				<UserProfilePicture src={user.profilePicture} size={30} />
				{variant === "landing" ? (
					<>
						{user.username}
						<ChevronDown className="h-4 w-4" />
					</>
				) : null}
			</Button>
		</UserMenu>
	);
};

export default UserButton;
