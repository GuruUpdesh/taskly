"use client";

import { UserProfile } from "@clerk/nextjs";

const UserProfilePage = () => (
	<div className="flex items-center justify-center bg-[#020713]">
		<UserProfile />
	</div>
);

export default UserProfilePage;
