import { format, isSameWeek, isSameYear, isToday } from "date-fns";

export function formatDateRelative(date: Date) {
	const timeFormat = "h:mm aaa";
	if (isToday(date)) {
		return format(date, timeFormat);
	}

	if (isSameWeek(date, new Date())) {
		// add day in format 'Mon, Tue, Wed, ..., Sun'
		return format(date, "E " + timeFormat);
	}

	const dateFormat = "E MMM do";
	if (isSameYear(date, new Date())) {
		return format(date, dateFormat);
	}

	return format(date, dateFormat + " y");
}
