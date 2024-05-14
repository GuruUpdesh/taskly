import { renderFilterValues } from "../src/utils/filter-values";

test("renderFilterValues renders filter values", () => {
	const values = ["unassigned"];
	const config = {
		type: "enum",
		options: [
			{
				key: "unassigned",
				color: "red",
				icon: "icon",
				displayName: "Unassigned",
			},
		],
		displayName: "Assignee",
	};
	expect(renderFilterValues(values, config)).not.toBeNull();
});

test("renderFilterValues doesn't render filter values", () => {
	const values = ["unassigned"];
	const config = {
		type: "not_enum",
		options: [
			{
				key: "assigned",
				color: "red",
				icon: "icon",
				displayName: "Assigned",
			},
		],
		displayName: "Assignee",
	};
	expect(renderFilterValues(values, config)).toBeNull();
});

test("renderFilterValues doesn't render filter values", () => {
	const values = ["unassigned"];
	const config = {
		type: "not_dynamic",
		options: [
			{
				key: "unassigned",
				color: "red",
				icon: "icon",
				displayName: "Unassigned",
			},
		],
		displayName: "Assignee",
	};
	expect(renderFilterValues(values, config)).toBeNull();
});
