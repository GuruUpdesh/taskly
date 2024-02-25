import {
	ArrowDownIcon,
	ArrowRightIcon,
	ArrowUpIcon,
	CheckCircledIcon,
	Component1Icon,
	EyeOpenIcon,
	PersonIcon,
	PieChartIcon,
	RadiobuttonIcon,
} from "@radix-ui/react-icons";
import { z } from "zod";
import type { NewTask, User, Task, Sprint } from "~/server/db/schema";
import {
	Activity,
	AlertOctagon,
	ArrowUpDown,
	Asterisk,
	Beaker,
	BugIcon,
	CircleDashed,
	Dot,
	Feather,
	LayoutList,
	Minus,
	Search,
	Text,
} from "lucide-react";
import { throwClientError } from "~/utils/errors";
import type { ColorOptions, TaskConfig } from "./entityTypes";
import UserProfilePicture from "~/components/user-profile-picture";
import { isAfter, isBefore } from "date-fns";
import { cva } from "class-variance-authority";

export const optionVariants = cva([], {
	variants: {
		color: {
			null: "text-slate-400 bg-slate-400/10 border-slate-400/15 hover:text-slate-200 focus:text-slate-200 hover:bg-slate-400/25 focus:bg-slate-400/25",
			grey: "text-slate-300 bg-slate-300/10 border-slate-300/15 hover:text-slate-100 focus:text-slate-100 hover:bg-slate-300/25 focus:bg-slate-300/25",
			orange: "text-orange-400 bg-orange-400/10 border-orange-400/15 hover:text-orange-200 focus:text-orange-200 hover:bg-orange-300/25 focus:bg-orange-300/25",
			yellow: "text-yellow-400 bg-yellow-400/10 border-yellow-400/15 hover:text-yellow-200 focus:text-yellow-200 hover:bg-yellow-300/25 focus:bg-yellow-300/25",
			red: "text-red-400 bg-red-400/10 border-red-400/15 hover:text-red-200 focus:text-red-200 hover:bg-red-300/25 focus:bg-red-300/25",
			blue: "text-blue-400 bg-blue-400/10 border-blue-400/15 hover:text-blue-200 focus:text-blue-200 hover:bg-blue-300/25 focus:bg-blue-300/25",
			green: "text-green-400 bg-green-400/10 border-green-400/15 hover:text-green-200 focus:text-green-200 hover:bg-green-300/25 focus:bg-green-300/25",
			purple: "text-violet-400 bg-violet-400/10 border-violet-400/15 hover:text-purple-200 focus:text-purple-200 hover:bg-violet-300/25 focus:bg-violet-300/25",
			teal: "text-teal-400 bg-teal-400/10 border-teal-400/15 hover:text-teal-200 focus:text-teal-200 hover:bg-teal-300/25 focus:bg-teal-300/25",
			fuchsia:
				"text-fuchsia-400 bg-fuchsia-400/10 border-fuchsia-400/15 hover:text-fuchsia-200 focus:text-fuchsia-200 hover:bg-fuchsia-300/25 focus:bg-fuchsia-300/25",
		},
	},
	defaultVariants: {},
});

export const taskConfig: TaskConfig = {
	id: {
		value: "id",
		displayName: "Task ID",
		type: "text",
		icon: <Dot className="h-4 w-4" />,
		form: {
			placeholder: "Task ID",
		},
	},
	title: {
		value: "title",
		displayName: "Title",
		type: "text",
		icon: <Minus className="h-4 w-4" />,
		form: {
			placeholder: "Untitled",
		},
	},
	description: {
		value: "description",
		displayName: "Description",
		type: "text",
		icon: <Text className="h-4 w-4" />,
		form: {
			placeholder: "Describe the task...",
		},
	},
	status: {
		value: "status",
		displayName: "Status",
		type: "select",
		icon: <CircleDashed className="h-4 w-4" />,
		form: {
			placeholder: "Status",
			options: [
				{
					value: "backlog",
					displayName: getStatusDisplayName("backlog"),
					icon: <CircleDashed className="h-4 w-4" />,
					color: "null",
				},
				{
					value: "todo",
					displayName: getStatusDisplayName("todo"),
					icon: <RadiobuttonIcon className="h-4 w-4" />,
					color: "grey",
				},
				{
					value: "inprogress",
					displayName: getStatusDisplayName("inprogress"),
					icon: <PieChartIcon className="h-4 w-4" />,
					color: "yellow",
				},
				{
					value: "inreview",
					displayName: getStatusDisplayName("inreview"),
					icon: <EyeOpenIcon className="h-4 w-4" />,
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
		icon: <ArrowUpDown className="h-4 w-4" />,
		form: {
			placeholder: "Priority",
			options: [
				{
					value: "none",
					displayName: "None",
					icon: <Minus className="h-4 w-4" />,
					color: "null",
				},
				{
					value: "low",
					displayName: "Low",
					icon: <ArrowDownIcon className="h-4 w-4" />,
					color: "blue",
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
					color: "orange",
				},
				{
					value: "critical",
					displayName: "Critical",
					icon: <AlertOctagon className="h-4 w-4" />,
					color: "red",
				},
			],
		},
	},
	type: {
		value: "type",
		displayName: "Type",
		type: "select",
		icon: <Asterisk className="h-4 w-4" />,
		form: {
			placeholder: "Type",
			options: [
				{
					value: "task",
					displayName: "Task",
					icon: <LayoutList className="h-4 w-4" />,
					color: "purple",
				},
				{
					value: "feature",
					displayName: "Feature",
					icon: <Feather className="h-4 w-4" />,
					color: "teal",
				},
				{
					value: "improvement",
					displayName: "Improvement",
					icon: <Activity className="h-4 w-4" />,
					color: "blue",
				},
				{
					value: "research",
					displayName: "Research",
					icon: <Search className="h-4 w-4" />,
					color: "green",
				},
				{
					value: "testing",
					displayName: "Testing",
					icon: <Beaker className="h-4 w-4" />,
					color: "yellow",
				},
				{
					value: "bug",
					displayName: "Bug",
					icon: <BugIcon className="h-4 w-4" />,
					color: "red",
				},
			],
		},
	},
	assignee: {
		value: "assignee",
		displayName: "Assignee",
		type: "select",
		icon: <PersonIcon className="h-4 w-4" />,
		form: {
			placeholder: "Assignee",
			options: [
				{
					value: "unassigned",
					displayName: "Unassigned",
					icon: <PersonIcon className="h-4 w-4" />,
					color: "null",
				},
			],
		},
	},
	sprintId: {
		value: "sprintId",
		displayName: "Sprint",
		type: "select",
		icon: <Component1Icon className="h-4 w-4" />,
		form: {
			placeholder: "Sprint",
			options: [
				{
					value: -1,
					displayName: "No Sprint",
					icon: <Component1Icon className="h-4 w-4 opacity-50" />,
					color: "null",
				},
			],
		},
	},
};

export const defaultValues: NewTask = {
	title: "",
	description: "",
	projectId: -1,
	status: "backlog",
	priority: "medium",
	type: "task",
	assignee: null,
	sprintId: -1,
	backlogOrder: 0,
	boardOrder: 0,
	lastEditedAt: new Date(),
	insertedDate: new Date(),
};

export function getTaskConfig(key: keyof TaskConfig) {
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
			const newOptions = assignees.map((assignee) => ({
				value: assignee.username,
				displayName: assignee.username,
				icon: (
					<UserProfilePicture
						size={16}
						src={assignee.profilePicture}
					/>
				),
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
		backlog: "Backlog",
		todo: "To Do",
		inprogress: "In Progress",
		inreview: "In Review",
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

type TaskOptions = {
	isPending?: boolean;
	isNew?: boolean;
};

export interface StatefulTask extends Task {
	options: TaskOptions;
}
