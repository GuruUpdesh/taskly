"use client";

import { UserProfile } from "@clerk/nextjs";

const UserProfilePage = () => (
	<div className="flex justify-center pt-8">
		<UserProfile
			path="/settings/account"
			appearance={{
				elements: {
					cardBox: "border rounded-lg",
					scrollBox:
						"bg-background-dialog/50 border-none shadow-none",
					navbar: "bg-background-dialog bg-gradient-to-r from-background-dialog-start to-background-dialog-end",
				},
			}}
		/>
	</div>
);

export default UserProfilePage;
