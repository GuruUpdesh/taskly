import { normalizeTaskSprintStatus } from "../src/features/tasks/utils/normalizeTaskSprintStatus";
import { points, priorities, types } from "../src/schema";

describe("normalizeTaskSprintStatus", () => {
	test("[Creation Case] Do Nothing", () => {
		const fromTask = {
			status: "backlog",
			sprintId: -1,
		};

		const currentSprintId = 3;

		expect(normalizeTaskSprintStatus(fromTask, currentSprintId)).toEqual({
			status: "backlog",
			sprintId: -1,
		});
	});

	test("[Creation Case] Change Sprint", () => {
		const fromTask = {
			status: "todo",
			sprintId: -1,
		};

		const currentSprintId = 2;

		expect(normalizeTaskSprintStatus(fromTask, currentSprintId)).toEqual({
			status: "todo",
			sprintId: 2,
		});
	});

	test("[Update Case] Remove Sprint", () => {
		const fromTask = {
			status: "todo",
			sprintId: 3,
		};

		const toTask = {
			status: "backlog",
			sprintId: 3,
		};

		const currentSprintId = 2;

		expect(
			normalizeTaskSprintStatus(fromTask, currentSprintId, toTask),
		).toEqual({
			status: "backlog",
			sprintId: -1,
		});
	});

	test("[Update Case] Change Status", () => {
		const fromTask = {
			status: "backlog",
			sprintId: -1,
		};

		const toTask = {
			status: "todo",
			sprintId: -1,
		};

		const currentSprintId = 4;

		expect(
			normalizeTaskSprintStatus(fromTask, currentSprintId, toTask),
		).toEqual({
			status: "todo",
			sprintId: 4,
		});
	});

	test("[Update Case] Change Status to Backlog", () => {
		const fromTask = {
			status: "todo",
			sprintId: 3,
		};

		const toTask = {
			status: "todo",
			sprintId: -1,
		};

		const currentSprintId = 3;

		expect(
			normalizeTaskSprintStatus(fromTask, currentSprintId, toTask),
		).toEqual({
			status: "backlog",
			sprintId: -1,
		});
	});

	test("[Update Case] Change Status to Todo", () => {
		const fromTask = {
			status: "backlog",
			sprintId: -1,
		};

		const toTask = {
			status: "backlog",
			sprintId: 2,
		};

		const currentSprintId = 2;

		expect(
			normalizeTaskSprintStatus(fromTask, currentSprintId, toTask),
		).toEqual({
			status: "todo",
			sprintId: 2,
		});
	});

	test("[Update Case] No Changes", () => {
		const fromTask = {
			status: "todo",
			sprintId: 3,
		};

		const toTask = {
			status: "todo",
			sprintId: 3,
		};

		const currentSprintId = 3;

		expect(
			normalizeTaskSprintStatus(fromTask, currentSprintId, toTask),
		).toEqual({
			status: "todo",
			sprintId: 3,
		});
	});

	test("[Create Case] No Changes", () => {
		const fromTask = {
			status: "todo",
			sprintId: 5,
		};

		const currentSprintId = 5;

		expect(normalizeTaskSprintStatus(fromTask, currentSprintId)).toEqual({
			status: "todo",
			sprintId: 5,
		});
	});

	test("[CREATE Case] All properties (not status or sprintId) shouldn't result in change", () => {
		const properties = {
			points,
			priorities,
			types,
		};

		for (const key in properties) {
			for (const val in properties[key]) {
				const fromTask = {
					status: "todo",
					[key]: val,
					sprintId: 3,
				};

				const currentSprintId = 3;

				expect(
					normalizeTaskSprintStatus(fromTask, currentSprintId),
				).toEqual({
					status: "todo",
					[key]: val,
					sprintId: 3,
				});
			}
		}
	});
});
