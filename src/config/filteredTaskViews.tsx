import { PersonIcon } from "@radix-ui/react-icons";
import { Activity, CircleDashed, Clock } from "lucide-react";

import { type Sprint } from "~/server/db/schema";
import { type Filter } from "~/store/app";
import { getCurrentSprintId } from "~/utils/getCurrentSprintId";

interface FilteredTaskViews {
	label: string;
	icon: React.ReactNode;
	filters: (sprints?: Sprint[], username?: string | null) => Filter[];
}

export const filteredTaskViews: FilteredTaskViews[] = [
	{
		label: "Me",
		icon: <PersonIcon className="h-4 w-4 min-w-4 bg-background" />,
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
		label: "Active",
		icon: <Activity className="h-4 w-4 min-w-4 bg-background" />,
		filters: () => {
			return [
				{
					property: "status",
					is: false,
					values: ["backlog", "done"],
					locked: true,
				},
			];
		},
	},
	{
		label: "Current Sprint",
		icon: <Clock className="h-4 w-4 min-w-4 bg-background" />,
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
		icon: <CircleDashed className="h-4 w-4 min-w-4 bg-background" />,
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
