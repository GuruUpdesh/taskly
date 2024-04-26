import React from "react";

import { toast } from "sonner";

import { getUser } from "~/actions/dashboard/dashboard-actions";
import typography from "~/styles/typography";

async function UserGreeting() {
	const result = await getUser();
	if (!result.success) {
		toast.error(result.message);
		return null;
	}

	return (
		<h1 className={typography.headers.h3}>
			Hello, {result.user.username}!
		</h1>
	);
}

export default UserGreeting;
