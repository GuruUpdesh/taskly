import { isAfter, isBefore } from "date-fns";

import { type Sprint } from "~/server/db/schema";

export function getCurrentSprintId(sprints: Sprint[]) {
	const currentSprint = sprints.find((sprint) =>
		helperIsSprintActive(sprint),
	);
	return currentSprint ? currentSprint.id : -1;
}

export function helperIsSprintActive(sprint: Sprint) {
	return (
		isAfter(new Date(), sprint.startDate) &&
		isBefore(new Date(), sprint.endDate)
	);
}
