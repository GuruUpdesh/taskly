"use client";

import { UserProfile } from "@clerk/nextjs";

const UserProfilePage = () => (
	<div className="flex min-h-screen items-center justify-center">
		<UserProfile path="/settings/account" />
	</div>
);

export default UserProfilePage;
