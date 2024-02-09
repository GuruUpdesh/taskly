import {
	ArrowDownIcon,
	ArrowRightIcon,
	ArrowUpIcon,
	CheckCircledIcon,
	CircleIcon,
	Component1Icon,
	PersonIcon,
	StopwatchIcon,
} from "@radix-ui/react-icons";
import type GenericEntityConfig from "./entityTypes";
import { z } from "zod";
import type { NewTask, User, Task, Sprint } from "~/server/db/schema";
import { BugIcon, Feather, LayoutList } from "lucide-react";
import { throwClientError } from "~/utils/errors";
import type { ColorOptions } from "./entityTypes";
import UserProfilePicture from "~/components/user-profile-picture";
import { isAfter, isBefore } from "date-fns";

type TaskConfig = Omit<Task, "projectId" | "boardOrder" | "backlogOrder">;

export const taskConfig: GenericEntityConfig<TaskConfig> = {
	id: {
		value: "id",
		displayName: "Task ID",
		type: "text",
		form: {
			placeholder: "Task ID",
		},
	},
	title: {
		value: "title",
		displayName: "Title",
		type: "text",
		form: {
			placeholder: "Untitled",
		},
	},
	description: {
		value: "description",
		displayName: "Description",
		type: "text",
		form: {
			placeholder: "Describe the task...",
		},
	},
	status: {
		value: "status",
		displayName: "Status",
		type: "select",
		form: {
			placeholder: "Status",
			options: [
				{
					value: "todo",
					displayName: getStatusDisplayName("todo"),
					icon: <CircleIcon className="h-4 w-4" />,
					color: "grey",
				},
				{
					value: "inprogress",
					displayName: getStatusDisplayName("inprogress"),
					icon: <StopwatchIcon className="h-4 w-4" />,
					color: "blue",
				},
				{
					value: "done",
					displayName: getStatusDisplayName("done"),
					icon: <CheckCircledIcon className="h-4 w-4" />,
					color: "green",
				},
			],
		},
	},
	priority: {
		value: "priority",
		displayName: "Priority",
		type: "select",
		form: {
			placeholder: "Priority",
			options: [
				{
					value: "low",
					displayName: "Low",
					icon: <ArrowDownIcon className="h-4 w-4" />,
					color: "grey",
				},
				{
					value: "medium",
					displayName: "Medium",
					icon: <ArrowRightIcon className="h-4 w-4" />,
					color: "yellow",
				},
				{
					value: "high",
					displayName: "High",
					icon: <ArrowUpIcon className="h-4 w-4" />,
					color: "red",
				},
			],
		},
	},
	type: {
		value: "type",
		displayName: "Type",
		type: "select",
		form: {
			placeholder: "Type",
			options: [
				{
					value: "task",
					displayName: "Task",
					icon: <LayoutList className="h-4 w-4" />,
					color: "blue",
				},
				{
					value: "bug",
					displayName: "Bug",
					icon: <BugIcon className="h-4 w-4" />,
					color: "red",
				},
				{
					value: "feature",
					displayName: "Feature",
					icon: <Feather className="h-4 w-4" />,
					color: "green",
				},
			],
		},
	},
	assignee: {
		value: "assignee",
		displayName: "Assignee",
		type: "select",
		form: {
			placeholder: "Assignee",
			options: [
				{
					value: "unassigned",
					displayName: "Unassigned",
					icon: <PersonIcon className="h-[20px] w-[20px]" />,
					color: "grey",
				},
			],
		},
	},
	sprintId: {
		value: "sprintId",
		displayName: "Sprint",
		type: "select",
		form: {
			placeholder: "Sprint",
			options: [
				{
					value: -1,
					displayName: "No Sprint",
					icon: <Component1Icon className="h-4 w-4 opacity-50" />,
					color: "grey",
				},
			],
		},
	},
};

export const defaultValues: NewTask = {
	title: "",
	description: "",
	projectId: -1,
	status: "todo",
	priority: "medium",
	type: "task",
	assignee: null,
	sprintId: -1,
	backlogOrder: 0,
	boardOrder: 0,
};

export function getTaskConfig(key: string) {
	if (Object.keys(taskConfig).indexOf(key) === -1) {
		throwClientError(`Configuration for key "${key}" not found.`);
		throw new Error(`Configuration for key "${key}" not found.`);
	}
	const config = taskConfig[key as keyof TaskConfig];
	return config;
}

export const taskSchema = z.object({
	id: z.number().optional(),
	title: z
		.string()
		.min(3, { message: "Title should be at least 3 characters long." })
		.max(100, { message: "Title should not exceed 100 characters." }),
	description: z
		.string()
		.max(500, { message: "Description should not exceed 500 characters." })
		.optional(),
	status: z.enum(["todo", "inprogress", "done"]),
	priority: z.enum(["low", "medium", "high"]),
	type: z.enum(["task", "bug", "feature"]),
	assignee: z.string().optional(),
});

export function buildDynamicOptions(
	config: ReturnType<typeof getTaskConfig>,
	key: string,
	assignees: User[],
	sprints: Sprint[],
): ReturnType<typeof getTaskConfig> {
	switch (key) {
		case "assignee":
			if (config.type !== "select" || !config.form.options) return config;
			const newOptions = assignees.map((asignee) => ({
				value: asignee.username,
				displayName: asignee.username,
				icon: <UserProfilePicture src={asignee.profilePicture} />,
				color: "grey" as ColorOptions,
			}));
			const currentOptions = config.form.options.map((option) => ({
				...option,
				value: option.value as string,
			}));
			const options = [...currentOptions, ...newOptions];
			return {
				...config,
				form: {
					...config.form,
					options,
				},
			};
		case "sprintId":
			if (config.type !== "select" || !config.form.options) return config;
			const newSprintOptions = sprints.map((sprint: Sprint) => {
				const active =
					isAfter(new Date(), sprint.startDate) &&
					isBefore(new Date(), sprint.endDate);
				return {
					value: sprint.id,
					displayName: sprint.name,
					icon: <Component1Icon className="h-4 w-4" />,
					color: active ? "green" : ("grey" as ColorOptions),
				};
			});
			const currentSprintOptions = config.form.options.map((option) => ({
				...option,
				value: option.value as number,
			}));
			const sprintOptions = [
				...currentSprintOptions,
				...newSprintOptions,
			];
			return {
				...config,
				form: {
					...config.form,
					options: sprintOptions,
				},
			};
		default:
			return config;
	}
}

export type Status = Task["status"];
export const taskStatuses: Status[] = ["todo", "inprogress", "done"] as const;

export function getStatusDisplayName(
	status: (typeof taskStatuses)[number],
): string {
	const statusDisplayNames: {
		[key in (typeof taskStatuses)[number]]?: string;
	} = {
		todo: "To Do",
		inprogress: "In Progress",
		done: "Done",
	};

	return statusDisplayNames[status] ?? status;
}

export function getOptionForStatus(status: Status) {
	const formConfig = taskConfig.status.form;
	if ("options" in formConfig) {
		const options = formConfig.options;
		const option = options.find((option) => option.value === status);
		return option;
	}
	return undefined;
}
