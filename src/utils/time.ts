import { getHours } from "date-fns";

export function getTimeOfDay() {
	const currentHour = getHours(new Date());

	if (currentHour < 12) {
		return "morning";
	} else if (currentHour < 18) {
		return "afternoon";
	} else {
		return "night";
	}
}
