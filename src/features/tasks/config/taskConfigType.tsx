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

import UserProfilePicture from "~/components/UserProfilePicture";
import {
	getSprintProgress,
	SprintProgressCircle,
} from "~/features/tasks/utils/getSprintIcon";
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
import { getSprintDateRage } from "~/utils/getSprintDateRange";

export type TaskProperty = keyof Task;
type StaticProperty = Extract<
	TaskProperty,
	| "id"
	| "insertedDate"
	| "lastEditedAt"
	| "projectId"
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
	"backlogOrder",
	"branchName",
] as const;

export const taskVariants = cva([], {
	variants: {
		color: {
			null: "text-neutral-200 bg-neutral-900/50",
			grey: "text-neutral-100 bg-neutral-800",
			blue: "text-[#BFD7ED] bg-[#1A365D]/80",
			indigo: "text-[#C7D2FE] bg-[#1E1B4B]/80",
			violet: "text-[#DDD6FE] bg-[#2E1065]/80",
			teal: "text-[#AFECEF] bg-[#134E4A]/80",
			cyan: "text-[#A5F3FC] bg-[#164E63]/80",
			amber: "text-[#FDE68A] bg-[#783A00]/80",
			red: "text-[#FECACA] bg-[#7F1D1D]/80",
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
		// Null/Default variants
		{
			color: "null",
			hover: true,
			class: "hover:text-neutral-100 focus:text-neutral-100 hover:bg-neutral-800/60 focus:bg-neutral-800/60 transition-all duration-200",
		},
		{
			color: "null",
			hover: "group",
			class: "group-hover:bg-neutral-800/60",
		},

		// Grey variants
		{
			color: "grey",
			hover: true,
			class: "hover:text-neutral-50 focus:text-neutral-50 hover:bg-neutral-700/60 focus:bg-neutral-700/60 transition-all duration-200",
		},
		{
			color: "grey",
			hover: "group",
			class: "group-hover:bg-neutral-700/60",
		},

		// Blue variants
		{
			color: "blue",
			hover: true,
			class: "hover:text-[#D7E6F5] focus:text-[#D7E6F5] hover:bg-[#1E3A8A]/60 focus:bg-[#1E3A8A]/60 transition-all duration-200",
		},
		{
			color: "blue",
			hover: "group",
			class: "group-hover:bg-[#1E3A8A]/60",
		},

		// Indigo variants
		{
			color: "indigo",
			hover: true,
			class: "hover:text-[#E0E7FF] focus:text-[#E0E7FF] hover:bg-[#312E81]/60 focus:bg-[#312E81]/60 transition-all duration-200",
		},
		{
			color: "indigo",
			hover: "group",
			class: "group-hover:bg-[#312E81]/60",
		},

		// Violet variants
		{
			color: "violet",
			hover: true,
			class: "hover:text-[#EDE9FE] focus:text-[#EDE9FE] hover:bg-[#4C1D95]/60 focus:bg-[#4C1D95]/60 transition-all duration-200",
		},
		{
			color: "violet",
			hover: "group",
			class: "group-hover:bg-[#4C1D95]/60",
		},

		// Teal variants
		{
			color: "teal",
			hover: true,
			class: "hover:text-[#CCFBF1] focus:text-[#CCFBF1] hover:bg-[#115E59]/60 focus:bg-[#115E59]/60 transition-all duration-200",
		},
		{
			color: "teal",
			hover: "group",
			class: "group-hover:bg-[#115E59]/60",
		},

		// Cyan variants
		{
			color: "cyan",
			hover: true,
			class: "hover:text-[#CFFAFE] focus:text-[#CFFAFE] hover:bg-[#155E75]/60 focus:bg-[#155E75]/60 transition-all duration-200",
		},
		{
			color: "cyan",
			hover: "group",
			class: "group-hover:bg-[#155E75]/60",
		},

		// Amber variants
		{
			color: "amber",
			hover: true,
			class: "hover:text-[#FEF3C7] focus:text-[#FEF3C7] hover:bg-[#92400E]/60 focus:bg-[#92400E]/60 transition-all duration-200",
		},
		{
			color: "amber",
			hover: "group",
			class: "group-hover:bg-[#92400E]/60",
		},

		// Red variants
		{
			color: "red",
			hover: true,
			class: "hover:text-[#FEE2E2] focus:text-[#FEE2E2] hover:bg-[#991B1B]/60 focus:bg-[#991B1B]/60 transition-all duration-200",
		},
		{
			color: "red",
			hover: "group",
			class: "group-hover:bg-[#991B1B]/60",
		},

		// Border styles for default context
		{
			color: "null",
			context: "default",
			class: "border border-neutral-800/50 shadow-sm",
		},
		{
			color: "grey",
			context: "default",
			class: "border border-neutral-700/50 shadow-sm",
		},
		{
			color: "blue",
			context: "default",
			class: "border border-[#1E3A8A]/50 shadow-sm",
		},
		{
			color: "indigo",
			context: "default",
			class: "border border-[#312E81]/50 shadow-sm",
		},
		{
			color: "violet",
			context: "default",
			class: "border border-[#4C1D95]/50 shadow-sm",
		},
		{
			color: "teal",
			context: "default",
			class: "border border-[#115E59]/50 shadow-sm",
		},
		{
			color: "cyan",
			context: "default",
			class: "border border-[#155E75]/50 shadow-sm",
		},
		{
			color: "amber",
			context: "default",
			class: "border border-[#92400E]/50 shadow-sm",
		},
		{
			color: "red",
			context: "default",
			class: "border border-[#991B1B]/50 shadow-sm",
		},

		// Hover effect for borders
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
				color: "grey",
			},
			{
				key: "todo",
				displayName: "To Do",
				icon: <RadiobuttonIcon className="h-4 w-4" />,
				color: "cyan",
			},
			{
				key: "inprogress",
				displayName: "In Progress",
				icon: <PieChartIcon className="h-4 w-4" />,
				color: "amber",
			},
			{
				key: "inreview",
				displayName: "In Review",
				icon: <EyeOpenIcon className="h-4 w-4" />,
				color: "indigo",
			},
			{
				key: "done",
				displayName: "Done",
				icon: <CheckCircledIcon className="h-4 w-4" />,
				color: "teal",
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
				color: "grey",
			},
			{
				key: "1",
				displayName: "1 Point",
				icon: <TbHexagonNumber1 className="h-4 w-4" />,
				color: "grey",
			},
			{
				key: "2",
				displayName: "2 Points",
				icon: <TbHexagonNumber2 className="h-4 w-4" />,
				color: "grey",
			},
			{
				key: "3",
				displayName: "3 Points",
				icon: <TbHexagonNumber3 className="h-4 w-4" />,
				color: "grey",
			},
			{
				key: "4",
				displayName: "4 Points",
				icon: <TbHexagonNumber4 className="h-4 w-4" />,
				color: "grey",
			},
			{
				key: "5",
				displayName: "5 Points",
				icon: <TbHexagonNumber5 className="h-4 w-4" />,
				color: "grey",
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
				color: "grey",
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
				color: "indigo",
			},
			{
				key: "high",
				displayName: "High",
				icon: <ArrowUpIcon className="h-4 w-4" />,
				color: "amber",
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
				color: "blue",
			},
			{
				key: "feature",
				displayName: "Feature",
				icon: <Feather className="h-4 w-4" />,
				color: "indigo",
			},
			{
				key: "improvement",
				displayName: "Improvement",
				icon: <Activity className="h-4 w-4" />,
				color: "violet",
			},
			{
				key: "research",
				displayName: "Research",
				icon: <Search className="h-4 w-4" />,
				color: "teal",
			},
			{
				key: "testing",
				displayName: "Testing",
				icon: <Beaker className="h-4 w-4" />,
				color: "cyan",
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
				color: "grey",
			},
		],
	},
	sprintId: {
		key: "sprintId",
		displayName: "Sprint",
		type: "dynamic",
		icon: <SprintProgressCircle progress={1} />,
		options: [
			{
				key: "-1",
				displayName: "No Sprint",
				icon: <SprintProgressCircle progress={0} />,
				color: "grey",
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

	const assigneeColor: Color = "grey";

	config.assignee.options = [
		...taskConfig.assignee.options,
		...assignees.map((assignee) => ({
			key: assignee.username,
			displayName: assignee.username,
			icon: (
				<UserProfilePicture size={18} src={assignee.profilePicture} />
			),
			color: assigneeColor,
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
			const progress = getSprintProgress(sprint);

			const isActive = helperIsSprintActive(sprint);
			const color: Color = isActive ? "teal" : "indigo";

			return {
				key: sprint.id.toString(),
				displayName: `${sprint.name} [${getSprintDateRage(sprint)}]`,
				icon: (
					<SprintProgressCircle
						progress={progress}
						className="h-4 w-4"
					/>
				),
				color: color,
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
	comments: number;
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
	branchName: schemaValidators.branchName,
});
