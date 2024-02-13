import React from "react";
import { toast } from "sonner";
import { getUser } from "~/actions/user-actions";
import { getTimeOfDay } from "~/utils/time";
import typography from "~/utils/typography";

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
