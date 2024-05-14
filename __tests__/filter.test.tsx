import { filterTasks } from "../src/utils/filter";

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
