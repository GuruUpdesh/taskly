import { type Task } from "~/schema";

type TaskStatus = Task["status"];
type TaskSprintId = Task["sprintId"];

// because of this all task operations will require both of these :(
type TaskKeys = {
	status: TaskStatus;
	sprintId: TaskSprintId;
};

export function normalizeTaskSprintStatus<T extends TaskKeys>(
	fromTask: T,
	currentSprintId: number,
	toTask?: T,
): T {
	const from = { ...fromTask };
	const to = toTask ? { ...toTask } : { ...from };

	// to see this case in action look at Create Task
	if (!toTask) {
		// backlog -> no sprint
		if ("status" in from && from.status === "backlog") {
			from.sprintId = -1;
		}

		// not backlog -> sprint
		if ("status" in from && from.status !== "backlog") {
			from.sprintId = currentSprintId;
		}

		return from;
	}

	console.log(
		"FROM: ----------------",
		{
			status: from.status,
			sprintId: from.sprintId,
		},
		"TO: ----------------",
		{
			status: to.status,
			spritId: to.sprintId,
		},
	);

	const changedKeys = getChangedKeys(from, to);

	if (
		changedKeys.indexOf("status") !== -1 &&
		changedKeys.indexOf("sprintId") === -1
	) {
		if (to.status === "backlog") {
			to.sprintId = -1;
		} else if (from.status === "backlog") {
			to.sprintId = currentSprintId;
		}
	} else if (
		changedKeys.indexOf("status") === -1 &&
		changedKeys.indexOf("sprintId") !== -1
	) {
		if (to.sprintId === -1) {
			to.status = "backlog";
		} else {
			to.status = "todo";
		}
	}

	return to;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function getChangedKeys<T extends Record<string, any>>(
	from: T,
	to: T,
): (keyof T)[] {
	const changedKeys: (keyof T)[] = [];

	for (const key in from) {
		if (from[key] !== to[key]) {
			changedKeys.push(key);
		}
	}

	return changedKeys;
}
