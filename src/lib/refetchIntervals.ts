import { env } from "process";

import { logger } from "~/lib/logger";

export function getRefetchIntervals() {
	const defaultIntervals = {
		tasks: 6 * 1000,
		projects: 20 * 1000,
		assignees: 10 * 1000,
		notifications: 10 * 1000,
		task: 6 * 1000,
	};

	if (env.NEXT_PUBLIC_NODE_ENV === "development") {
		logger.warn("[React Query] Using development refetch intervals!");
		const devIntervals = {
			tasks: defaultIntervals.tasks * 5,
			projects: defaultIntervals.projects * 5,
			assignees: defaultIntervals.assignees * 5,
			notifications: defaultIntervals.notifications * 5,
			task: defaultIntervals.task * 5,
		};
		return devIntervals;
	} else {
		// logger.warn("[React Query] Using production refetch intervals!");
	}

	return defaultIntervals;
}
