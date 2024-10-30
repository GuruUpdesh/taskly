import { type Sprint } from "~/server/db/schema";
import { type Filter } from "~/store/app";
import { getCurrentSprintId } from "~/utils/getCurrentSprintId";

interface FilteredTaskViews {
	label: string;
	filters: (sprints?: Sprint[], username?: string | null) => Filter[];
}

export const filteredTaskViews: FilteredTaskViews[] = [
	{
		label: "Me",
		filters: (_, username) => {
			if (!username) {
				console.error("Me view requires username to be passed in.");
				return [];
			}
			return [
				{
					property: "assignee",
					is: true,
					values: [username],
					locked: true,
				},
			];
		},
	},
	{
		label: "Current",
		filters: (sprints) => {
			if (!sprints) {
				console.error(
					"Current sprint view requires sprints to be passed in.",
				);
				return [];
			}
			const currentSprint = getCurrentSprintId(sprints);
			if (currentSprint === -1) {
				console.warn("No active sprint found.");
				return [];
			}
			return [
				{
					property: "sprintId",
					is: true,
					values: [currentSprint.toString()],
					locked: true,
				},
			];
		},
	},
	{
		label: "Backlog",
		filters: () => [
			{
				property: "status",
				is: true,
				values: ["backlog"],
				locked: true,
			},
		],
	},
];
