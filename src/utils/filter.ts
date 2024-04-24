import { type StatefulTask } from "~/config/taskConfigType";
import { type Filter } from "~/store/app";

export function filterTasks(task: StatefulTask, filters: Filter[]): boolean {
	for (const filter of filters) {
		if (filter.property === "") {
			continue;
		}
		let taskValue = task[filter.property]; // The value of the task's property
		if (taskValue === null) {
			if (filter.property === "assignee") {
				taskValue = "unassigned";
			} else if (filter.property === "sprintId") {
				taskValue = "-1";
			} else {
				taskValue = "";
			}
		}
		const matchesValue = filter.values.includes(taskValue.toString()); // Check if the task's property value matches one of the filter's values

		// If is is true, but the task's property value does not match any of the filter's values, return false
		if (filter.is && !matchesValue) {
			return false;
		}

		// If is is false, but the task's property value matches one of the filter's values, also return false
		if (!filter.is && matchesValue) {
			return false;
		}
	}

	// If none of the filters cause a return of false, the task passes all filters
	return true;
}
