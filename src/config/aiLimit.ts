import { format, addDays, differenceInMilliseconds } from "date-fns";

export const AIDAILYLIMIT = 20;

export function timeTillNextReset() {
	const now = new Date();
	const todayMidnightUTC = new Date(
		Date.UTC(
			now.getUTCFullYear(),
			now.getUTCMonth(),
			now.getUTCDate(),
			0,
			0,
			0,
		),
	);
	let nextMidnightUTC = todayMidnightUTC;
	if (now > todayMidnightUTC) {
		nextMidnightUTC = addDays(todayMidnightUTC, 1);
	}
	const differenceMs = differenceInMilliseconds(nextMidnightUTC, now);
	const timeLeft = new Date(differenceMs);
	const formattedTimeLeft = format(timeLeft, "h");
	return formattedTimeLeft;
}
