import React from "react";

import { auth } from "@clerk/nextjs";
import { toast } from "sonner";

import { getUser } from "~/actions/user-actions";
import { Button } from "~/components/ui/button";
import UserProfilePicture from "~/components/user-profile-picture";

import UserMenu from "./user-menu";

const UserButton = async () => {
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
			<Button variant="ghost" size="icon" className="min-w-[30px]">
				<UserProfilePicture src={user.profilePicture} size={30} />
			</Button>
		</UserMenu>
	);
};

export default UserButton;
