import {
	Clock1,
	Clock2,
	Clock3,
	Clock4,
	Clock5,
	Clock6,
	Clock7,
	Clock8,
	Clock9,
	Clock10,
	Clock11,
	Clock12,
} from "lucide-react";

import { type Sprint } from "~/server/db/schema";

const clockIcons = [
	<Clock1 key={1} className="h-4 w-4" />,
	<Clock2 key={2} className="h-4 w-4" />,
	<Clock3 key={3} className="h-4 w-4" />,
	<Clock4 key={4} className="h-4 w-4" />,
	<Clock5 key={5} className="h-4 w-4" />,
	<Clock6 key={6} className="h-4 w-4" />,
	<Clock7 key={7} className="h-4 w-4" />,
	<Clock8 key={8} className="h-4 w-4" />,
	<Clock9 key={9} className="h-4 w-4" />,
	<Clock10 key={10} className="h-4 w-4" />,
	<Clock11 key={11} className="h-4 w-4" />,
	<Clock12 key={12} className="h-4 w-4" />,
];

export function getSprintProgress(sprint: Sprint) {
	const now = new Date();
	const sprintDuration =
		sprint.endDate.getTime() - sprint.startDate.getTime();
	const elapsed = now.getTime() - sprint.startDate.getTime();
	return Math.min(Math.max(elapsed / sprintDuration, 0), 1); // Clamp between 0 and 1
}

export function getClockIconForSprintProgress(progress: number) {
	// Progress is a value between 0 and 1, where 0 is start and 1 is complete
	const index = Math.min(
		Math.floor(progress * clockIcons.length),
		clockIcons.length - 1,
	);
	return clockIcons[index];
}
