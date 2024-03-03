import React from "react";

import { toast } from "sonner";

import { getUser } from "~/actions/dashboard/dashboard-actions";
import typography from "~/styles/typography";
import { getTimeOfDay } from "~/utils/time";

async function UserGreeting() {
	const result = await getUser();
	if (!result.success) {
		toast.error(result.message);
		return null;
	}

	const timeOfDay = getTimeOfDay();
	return (
		<h1 className={typography.headers.h3}>
			Good {timeOfDay}, {result.user.username}!
		</h1>
	);
}

export default UserGreeting;
