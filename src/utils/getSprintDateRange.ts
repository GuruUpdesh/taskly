import { format } from "date-fns";

import { type Sprint } from "~/server/db/schema";

export function getSprintDateRage(sprint: Sprint) {
	const startDate = format(new Date(sprint.startDate), "MMM d");
	const endDate = format(new Date(sprint.endDate), "MMM d");
	return `${startDate} - ${endDate}`;
}
