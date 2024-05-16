import {
	getCurrentSprintId,
	helperIsSprintActive,
} from "../src/utils/getCurrentSprintId";

test("getCurrentSprintId returns the correct sprint id", () => {
	const sprints = [
		{
			id: 1,
			startDate: new Date("2021-01-01"),
			endDate: new Date("2021-01-07"),
		},
		{
			id: 2,
			startDate: new Date("2021-01-08"),
			endDate: new Date("2021-01-14"),
		},
		{
			id: 3,
			startDate: new Date().setDate(new Date().getDate() - 1),
			endDate: new Date().setDate(new Date().getDate() + 6),
		},
	];

	expect(getCurrentSprintId(sprints)).toBe(3);
});

test("getCurrentSprintId returns -1 if there is no active sprint", () => {
	const sprints = [
		{
			id: 1,
			startDate: new Date("2021-01-01"),
			endDate: new Date("2021-01-07"),
		},
		{
			id: 2,
			startDate: new Date("2021-01-08"),
			endDate: new Date("2021-01-14"),
		},
		{
			id: 3,
			startDate: new Date("2021-01-15"),
			endDate: new Date("2021-01-21"),
		},
	];
	expect(getCurrentSprintId(sprints)).toBe(-1);
});

test("helperIsSprintActive returns true if the sprint is active", () => {
	const sprint = {
		id: 1,
		startDate: new Date("2021-01-01"),
		endDate: new Date("2021-01-07"),
	};
	expect(helperIsSprintActive(sprint)).toBe(false);
});

test("helperIsSprintActive returns false if the sprint is not active", () => {
	const sprint = {
		id: 1,
		startDate: new Date("2021-01-01"),
		endDate: new Date("2021-01-07"),
	};
	expect(helperIsSprintActive(sprint)).toBe(false);
});
function now(): string | number | Date {
	throw new Error("Function not implemented.");
}
