import React from "react";
import { auth, clerkClient } from "@clerk/nextjs";
import { toast } from "sonner";
import { Button } from "../ui/button";
import UserProfilePicture from "../user-profile-picture";
import UserMenu from "./user-menu";

const UserButton = async () => {
	const { userId } = auth();

	if (!userId) {
		toast.error("You must be logged in to view this page");
		return null;
	}

	const user = await clerkClient.users.getUser(userId);

	return (
		<UserMenu>
			<Button variant="ghost" size="icon">
				<UserProfilePicture src={user?.imageUrl} size={30} />
			</Button>
		</UserMenu>
	);
};

export default UserButton;