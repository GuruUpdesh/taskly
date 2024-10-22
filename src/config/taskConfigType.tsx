import {
	ArrowDownIcon,
	ArrowRightIcon,
	ArrowUpIcon,
	CheckCircledIcon,
	EyeOpenIcon,
	GitHubLogoIcon,
	PersonIcon,
	PieChartIcon,
	RadiobuttonIcon,
} from "@radix-ui/react-icons";
import { type VariantProps, cva } from "class-variance-authority";
import _ from "lodash";
import {
	Activity,
	AlertOctagon,
	ArrowUpDown,
	Asterisk,
	Beaker,
	BugIcon,
	CircleDashed,
	Clock,
	Dot,
	Feather,
	LayoutList,
	Minus,
	Search,
	Text,
} from "lucide-react";
import {
	TbHexagonNumber1,
	TbHexagonNumber2,
	TbHexagonNumber3,
	TbHexagonNumber4,
	TbHexagonNumber5,
	TbHexagon,
} from "react-icons/tb";
import { z } from "zod";

import UserProfilePicture from "~/app/components/UserProfilePicture";
import {
	type User,
	type Task,
	type Sprint,
	selectTaskSchema,
} from "~/server/db/schema";
import {
	getCurrentSprintId,
	helperIsSprintActive,
} from "~/utils/getCurrentSprintId";
import {
	getClockIconForSprintProgress,
	getSprintProgress,
} from "~/utils/getSprintIcon";

export type TaskProperty = keyof Task;
type StaticProperty = Extract<
	TaskProperty,
	| "id"
	| "insertedDate"
	| "lastEditedAt"
	| "projectId"
	| "boardOrder"
	| "backlogOrder"
	| "branchName"
>;
type EnumProperty = Extract<
	TaskProperty,
	"status" | "points" | "priority" | "type"
>;
type DynamicProperty = Extract<TaskProperty, "sprintId" | "assignee">;
type TextProperty = Extract<TaskProperty, "title" | "description">;

export const taskProperties: TaskProperty[] = [
	"id",
	"title",
	"description",
	"status",
	"points",
	"priority",
	"type",
	"assignee",
	"sprintId",
	"lastEditedAt",
	"insertedDate",
	"projectId",
	"boardOrder",
	"backlogOrder",
	"branchName",
] as const;

export const taskVariants = cva([], {
	variants: {
		color: {
			null: "text-neutral-400 bg-neutral-900/50",
			grey: "text-neutral-200 bg-neutral-800/50",
			orange: "text-orange-200 bg-orange-800/50",
			yellow: "text-yellow-200 bg-yellow-800/50",
			red: "text-red-200 bg-red-800/50",
			blue: "text-blue-200 bg-blue-800/50",
			green: "text-green-200 bg-green-800/50",
			purple: "text-violet-200 bg-violet-800/50",
			teal: "text-teal-200 bg-teal-800/50",
			fuchsia: "text-fuchsia-200 bg-fuchsia-800/50",
		},
		hover: {
			true: "",
			false: "",
			group: "",
		},
		context: {
			default: "",
			menu: "!bg-transparent",
		},
	},
	compoundVariants: [
		{
			color: "null",
			hover: true,
			class: "hover:text-slate-300 focus:text-slate-300 hover:bg-accent focus:bg-accent transition-colors",
		},
		{
			color: "null",
			hover: "group",
			class: "group-hover:bg-accent",
		},
		{
			color: "grey",
			hover: true,
			class: "hover:text-slate-200 focus:text-slate-200 hover:bg-slate-400/25 focus:bg-slate-400/25 transition-colors",
		},
		{
			color: "grey",
			hover: "group",
			class: "group-hover:bg-slate-400/25",
		},
		{
			color: "orange",
			hover: true,
			class: "hover:text-orange-200 focus:text-orange-200 hover:bg-orange-400/25 focus:bg-orange-400/25 transition-colors",
		},
		{
			color: "orange",
			hover: "group",
			class: "group-hover:bg-orange-400/25",
		},
		{
			color: "yellow",
			hover: true,
			class: "hover:text-yellow-100 focus:text-yellow-100 hover:bg-yellow-400/25 focus:bg-yellow-400/25 transition-colors",
		},
		{
			color: "yellow",
			hover: "group",
			class: "group-hover:bg-yellow-400/25",
		},
		{
			color: "red",
			hover: true,
			class: "hover:text-red-200 focus:text-red-200 hover:bg-red-400/25 focus:bg-red-400/25 transition-colors",
		},
		{
			color: "red",
			hover: "group",
			class: "group-hover:bg-red-400/25",
		},
		{
			color: "blue",
			hover: true,
			class: "hover:text-blue-100 focus:text-blue-100 hover:bg-blue-400/25 focus:bg-blue-400/25 transition-colors",
		},
		{
			color: "blue",
			hover: "group",
			class: "group-hover:bg-blue-400/25",
		},
		{
			color: "green",
			hover: true,
			class: "hover:text-green-200 focus:text-green-200 hover:bg-green-400/25 focus:bg-green-400/25 transition-colors",
		},
		{
			color: "green",
			hover: "group",
			class: "group-hover:bg-green-400/25",
		},
		{
			color: "purple",
			hover: true,
			class: "hover:text-purple-200 focus:text-purple-200 hover:bg-violet-400/25 focus:bg-violet-400/25 transition-colors",
		},
		{
			color: "purple",
			hover: "group",
			class: "group-hover:bg-violet-400/25",
		},
		{
			color: "teal",
			hover: true,
			class: "hover:text-teal-200 focus:text-teal-200 hover:bg-teal-400/25 focus:bg-teal-400/25 transition-colors",
		},
		{
			color: "teal",
			hover: "group",
			class: "group-hover:bg-teal-400/25",
		},
		{
			color: "fuchsia",
			hover: true,
			context: ["default", "menu"],
			class: "hover:text-fuchsia-200 focus:text-fuchsia-200 hover:bg-fuchsia-400/25 focus:bg-fuchsia-400/25 transition-colors",
		},
		{
			color: "fuchsia",
			hover: "group",
			class: "group-hover:bg-fuchsia-400/25",
		},
		{
			color: "null",
			context: "default",
			class: "border",
		},
		{
			color: "grey",
			context: "default",
			class: "border border-slate-400/25",
		},
		{ color: "red", context: "default", class: "border border-red-400/25" },
		{
			color: "blue",
			context: "default",
			class: "border border-blue-400/25",
		},
		{
			color: "green",
			context: "default",
			class: "border border-green-400/25",
		},
		{
			color: "purple",
			context: "default",
			class: "border border-violet-400/25",
		},
		{
			color: "teal",
			context: "default",
			class: "border border-teal-400/25",
		},
		{
			color: "orange",
			context: "default",
			class: "border border-orange-400/25",
		},
		{
			color: "yellow",
			context: "default",
			class: "border border-yellow-400/25",
		},
		{
			color: "fuchsia",
			context: "default",
			class: "border border-fuchsia-400/25",
		},
		{
			hover: true,
			context: "default",
			class: "hover:border-transparent focus:border-transparent",
		},
	],
	defaultVariants: {
		color: "null",
		hover: false,
		context: "default",
	},
});

export type VariantPropsType = VariantProps<typeof taskVariants>;

export type Color = Exclude<VariantPropsType["color"], null | undefined>;

export type Option<T> = {
	key: T;
	displayName: string;
	icon: JSX.Element;
	color: Color;
};

type TaskGeneric<T> = {
	key: T;
	displayName: string;
	icon: JSX.Element;
};

type TaskConfig = {
	[P in
		| TextProperty
		| EnumProperty
		| DynamicProperty
		| StaticProperty]: P extends TextProperty
		? TaskGeneric<P> & {
				type: "text";
			}
		: P extends EnumProperty
			? TaskGeneric<P> & {
					type: "enum";
					options: Option<Task[P]>[];
				}
			: P extends DynamicProperty
				? TaskGeneric<P> & {
						type: "dynamic";
						options: Option<string>[];
					}
				: TaskGeneric<P> & {
						type: "static";
					};
};

export const taskConfig: TaskConfig = {
	id: {
		key: "id",
		displayName: "ID",
		icon: <Dot className="h-4 w-4" />,
		type: "static",
	},
	title: {
		key: "title",
		displayName: "Title",
		icon: <Minus className="h-4 w-4" />,
		type: "text",
	},
	description: {
		key: "description",
		displayName: "Description",
		icon: <Text className="h-4 w-4" />,
		type: "text",
	},
	status: {
		key: "status",
		displayName: "Status",
		icon: <CircleDashed className="h-4 w-4" />,
		type: "enum",
		options: [
			{
				key: "backlog",
				displayName: "Backlog",
				icon: <CircleDashed className="h-4 w-4" />,
				color: "null",
			},
			{
				key: "todo",
				displayName: "To Do",
				icon: <RadiobuttonIcon className="h-4 w-4" />,
				color: "grey",
			},
			{
				key: "inprogress",
				displayName: "In Progress",
				icon: <PieChartIcon className="h-4 w-4" />,
				color: "yellow",
			},
			{
				key: "inreview",
				displayName: "In Review",
				icon: <EyeOpenIcon className="h-4 w-4" />,
				color: "blue",
			},
			{
				key: "done",
				displayName: "Done",
				icon: <CheckCircledIcon className="h-4 w-4" />,
				color: "green",
			},
		],
	},
	points: {
		key: "points",
		displayName: "Points",
		icon: <TbHexagon className="h-4 w-4" />,
		type: "enum",
		options: [
			{
				key: "0",
				displayName: "No Estimate",
				icon: <TbHexagon className="h-4 w-4" />,
				color: "null",
			},
			{
				key: "1",
				displayName: "1 Point",
				icon: <TbHexagonNumber1 className="h-4 w-4" />,
				color: "null",
			},
			{
				key: "2",
				displayName: "2 Points",
				icon: <TbHexagonNumber2 className="h-4 w-4" />,
				color: "null",
			},
			{
				key: "3",
				displayName: "3 Points",
				icon: <TbHexagonNumber3 className="h-4 w-4" />,
				color: "null",
			},
			{
				key: "4",
				displayName: "4 Points",
				icon: <TbHexagonNumber4 className="h-4 w-4" />,
				color: "null",
			},
			{
				key: "5",
				displayName: "5 Points",
				icon: <TbHexagonNumber5 className="h-4 w-4" />,
				color: "null",
			},
		],
	},
	priority: {
		key: "priority",
		displayName: "Priority",
		icon: <ArrowUpDown className="h-4 w-4" />,
		type: "enum",
		options: [
			{
				key: "none",
				displayName: "None",
				icon: <Minus className="h-4 w-4" />,
				color: "null",
			},
			{
				key: "low",
				displayName: "Low",
				icon: <ArrowDownIcon className="h-4 w-4" />,
				color: "blue",
			},
			{
				key: "medium",
				displayName: "Medium",
				icon: <ArrowRightIcon className="h-4 w-4" />,
				color: "yellow",
			},
			{
				key: "high",
				displayName: "High",
				icon: <ArrowUpIcon className="h-4 w-4" />,
				color: "orange",
			},
			{
				key: "critical",
				displayName: "Critical",
				icon: <AlertOctagon className="h-4 w-4" />,
				color: "red",
			},
		],
	},
	type: {
		key: "type",
		displayName: "Type",
		type: "enum",
		icon: <Asterisk className="h-4 w-4" />,
		options: [
			{
				key: "task",
				displayName: "Task",
				icon: <LayoutList className="h-4 w-4" />,
				color: "purple",
			},
			{
				key: "feature",
				displayName: "Feature",
				icon: <Feather className="h-4 w-4" />,
				color: "fuchsia",
			},
			{
				key: "improvement",
				displayName: "Improvement",
				icon: <Activity className="h-4 w-4" />,
				color: "blue",
			},
			{
				key: "research",
				displayName: "Research",
				icon: <Search className="h-4 w-4" />,
				color: "green",
			},
			{
				key: "testing",
				displayName: "Testing",
				icon: <Beaker className="h-4 w-4" />,
				color: "yellow",
			},
			{
				key: "bug",
				displayName: "Bug",
				icon: <BugIcon className="h-4 w-4" />,
				color: "red",
			},
		],
	},
	assignee: {
		key: "assignee",
		displayName: "Assignee",
		type: "dynamic",
		icon: <PersonIcon className="h-4 w-4" />,
		options: [
			{
				key: "unassigned",
				displayName: "Unassigned",
				icon: <PersonIcon className="h-4 w-4" />,
				color: "null",
			},
		],
	},
	sprintId: {
		key: "sprintId",
		displayName: "Sprint",
		type: "dynamic",
		icon: <Clock className="h-4 w-4" />,
		options: [
			{
				key: "-1",
				displayName: "No Sprint",
				icon: <Clock className="h-4 w-4 opacity-50" />,
				color: "null",
			},
		],
	},
	lastEditedAt: {
		key: "lastEditedAt",
		displayName: "Last Edited",
		icon: <Clock className="h-4 w-4" />,
		type: "static",
	},
	insertedDate: {
		key: "insertedDate",
		displayName: "Inserted",
		icon: <Clock className="h-4 w-4" />,
		type: "static",
	},
	projectId: {
		key: "projectId",
		displayName: "Project",
		icon: <Dot className="h-4 w-4" />,
		type: "static",
	},
	boardOrder: {
		key: "boardOrder",
		displayName: "Board Order",
		icon: <Dot className="h-4 w-4" />,
		type: "static",
	},
	backlogOrder: {
		key: "backlogOrder",
		displayName: "Backlog Order",
		icon: <Dot className="h-4 w-4" />,
		type: "static",
	},
	branchName: {
		key: "branchName",
		displayName: "Branch Name",
		icon: <GitHubLogoIcon className="h-4 w-4" />,
		type: "static",
	},
};

function getDynamicConfig(assignees: User[], sprints: Sprint[]) {
	const config = _.cloneDeep(taskConfig);

	config.assignee.options = [
		...taskConfig.assignee.options,
		...assignees.map((assignee) => ({
			key: assignee.username,
			displayName: assignee.username,
			icon: (
				<UserProfilePicture size={18} src={assignee.profilePicture} />
			),
			color: "grey" as Color,
		})),
	];

	const currentSprintId = getCurrentSprintId(sprints);
	const currentSprintIndex = sprints
		.map((s) => s.id)
		.indexOf(currentSprintId);
	const sprintsToDisplay = sprints.filter(
		(_, i) => currentSprintIndex - 2 < i && i < currentSprintIndex + 2,
	);

	config.sprintId.options = [
		...taskConfig.sprintId.options,
		...sprintsToDisplay.map((sprint) => {
			const isActive = helperIsSprintActive(sprint);
			let ClockIcon = <Clock className="h-4 w-4" />;
			if (isActive) {
				const progress = getSprintProgress(sprint);
				const dynamicIcon = getClockIconForSprintProgress(progress);
				if (dynamicIcon) {
					ClockIcon = dynamicIcon;
				}
			}

			return {
				key: sprint.id.toString(),
				displayName: sprint.name,
				icon: ClockIcon,
				color: isActive ? "green" : ("orange" as Color),
			};
		}),
	];

	return config;
}

// Implementation
export function getPropertyConfig(
	property: TaskProperty,
	assignees?: User[],
	sprints?: Sprint[],
) {
	let config = taskConfig[property];

	// Check if property is 'sprintId' or 'assignee', and ensure additional parameters are provided
	if (
		(property === "assignee" || property === "sprintId") &&
		assignees &&
		sprints
	) {
		config = getDynamicConfig(assignees, sprints)[property];
	} else if (property === "assignee" || property === "sprintId") {
		console.warn(
			`getPropertyConfig: ${property} requires additional parameters to be provided`,
		);
	}

	return config;
}

/**
 * Given a value of a task property, return the corresponding option from the taskConfig
 * Example: "backlog" -> { key: "backlog", displayName: "Backlog", icon: <CircleDashed />, color: "null" }
 *
 * @param optionKey
 * @returns
 */
export function getEnumOptionByKey(optionKey: string) {
	for (const property in taskConfig) {
		const config = taskConfig[property as keyof typeof taskConfig];

		if (config.type === "enum" && config.options) {
			const option = config.options.find((opt) => opt.key === optionKey);

			if (option) {
				return option;
			}
		}
	}

	console.warn(
		`getEnumOptionByKey: Option key '${optionKey}' was not found in any enum properties.`,
	);
	return null;
}

export const schemaValidators = {
	id: z.number().min(1),
	title: z
		.string()
		.min(1, "Title must be at least one character long.")
		.max(225, "Title must be at most 225 characters long."),
	description: z.string(),
	status: selectTaskSchema.shape.status,
	points: selectTaskSchema.shape.points,
	priority: selectTaskSchema.shape.priority,
	type: selectTaskSchema.shape.type,
	assignee: z
		.string()
		.max(225, "Assignee must be at most 225 characters long."),
	projectId: z.number().min(1),
	sprintId: z.string(),
	boardOrder: z.number().min(0),
	backlogOrder: z.number().min(0),
	lastEditedAt: selectTaskSchema.shape.lastEditedAt,
	insertedDate: selectTaskSchema.shape.insertedDate,
	branchName: z.string().nullable(),
};

export function buildValidator(keys: TaskProperty[]) {
	return z.object(
		Object.fromEntries(
			keys.map((key) => {
				return [key, schemaValidators[key]];
			}),
		),
	);
}

export const defaultValues = {
	title: "",
	description: "",
	status: "backlog",
	points: "1",
	priority: "none",
	type: "task",
	assignee: "unassigned",
	sprintId: "-1",
	id: 0,
	projectId: 0,
	boardOrder: 0,
	backlogOrder: 0,
	lastEditedAt: new Date(),
	insertedDate: new Date(),
} as const;

type TaskOptions = {
	isPending?: boolean;
	isNew?: boolean;
};

export interface StatefulTask extends Task {
	options: TaskOptions;
}

export const CreateTaskSchema = z.object({
	title: schemaValidators.title,
	description: schemaValidators.description,
	status: schemaValidators.status,
	points: schemaValidators.points,
	priority: schemaValidators.priority,
	type: schemaValidators.type,
	assignee: schemaValidators.assignee.transform((val) =>
		val === "unassigned" ? null : val,
	),
	projectId: schemaValidators.projectId,
	sprintId: schemaValidators.sprintId.transform((val) => parseInt(val)),
	backlogOrder: schemaValidators.backlogOrder,
	boardOrder: schemaValidators.boardOrder,
	branchName: schemaValidators.branchName,
});
