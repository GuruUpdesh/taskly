import { filterTasks } from "../src/utils/filter";

// export function filterTasks(task: StatefulTask, filters: Filter[]): boolean {
// 	for (const filter of filters) {
// 		if (filter.property === "") {
// 			continue;
// 		}
// 		let taskValue = task[filter.property]; // The value of the task's property
// 		if (taskValue === null) {
// 			if (filter.property === "assignee") {
// 				taskValue = "unassigned";
// 			} else if (filter.property === "sprintId") {
// 				taskValue = "-1";
// 			} else {
// 				taskValue = "";
// 			}
// 		}
// 		const matchesValue = filter.values.includes(taskValue.toString()); // Check if the task's property value matches one of the filter's values

// 		// If is is true, but the task's property value does not match any of the filter's values, return false
// 		if (filter.is && !matchesValue) {
// 			return false;
// 		}

// 		// If is is false, but the task's property value matches one of the filter's values, also return false
// 		if (!filter.is && matchesValue) {
// 			return false;
// 		}
// 	}

// 	// If none of the filters cause a return of false, the task passes all filters
// 	return true;
// }

test("filterTasks filters tasks", () => {
	const task = {
		id: 1,
		assignee: "unassigned",
		sprintId: "-1",
	};
	const filters = [
		{
			property: "assignee",
			values: ["unassigned"],
			is: true,
		},
		{
			property: "sprintId",
			values: ["-1"],
			is: true,
		},
	];
	expect(filterTasks(task, filters)).toBe(true);
});

test("filterTasks filters tasks", () => {
	const task = {
		id: 2,
		assignee: "unassigned",
		sprintId: "-1",
	};
	const filters = [
		{
			property: "assignee",
			values: ["unassigned"],
			is: true,
		},
		{
			property: "sprintId",
			values: ["-1"],
			is: true,
		},
	];
	expect(filterTasks(task, filters)).toBe(true);
});

test("filterTasks doesn't filter tasks", () => {
	const task = {
		id: 1,
		assignee: "unassigned",
		sprintId: "-1",
	};
	const filters = [
		{
			property: "assignee",
			values: ["unassigned"],
			is: false,
		},
		{
			property: "sprintId",
			values: ["-1"],
			is: false,
		},
	];
	expect(filterTasks(task, filters)).toBe(false);
});

test("filterTasks doesn't filter tasks", () => {
	const task = {
		id: 2,
		assignee: "unassigned",
		sprintId: "-1",
	};
	const filters = [
		{
			property: "assignee",
			values: ["unassigned"],
			is: false,
		},
		{
			property: "sprintId",
			values: ["-1"],
			is: false,
		},
	];
	expect(filterTasks(task, filters)).toBe(false);
});
