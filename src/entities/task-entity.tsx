import {
	ArrowDownIcon,
	ArrowRightIcon,
	ArrowUpIcon,
	CheckCircledIcon,
	CircleIcon,
	StopwatchIcon,
} from "@radix-ui/react-icons";
import type GenericEntityConfig from "./entityTypes";
import { z } from "zod";
import type { NewTask, User, Task } from "~/server/db/schema";
import { BugIcon, Feather, LayoutList } from "lucide-react";
import { throwClientError } from "~/utils/errors";
import type { ColorOptions } from "./entityTypes";
import UserProfilePicture from "~/components/user-profile-picture";

type TaskConfig = Omit<Task, "projectId">;

const taskConfig: GenericEntityConfig<TaskConfig> = {
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
					displayName: "To Do",
					icon: <CircleIcon className="h-4 w-4" />,
					color: "grey",
				},
				{
					value: "inprogress",
					displayName: "In Progress",
					icon: <StopwatchIcon className="h-4 w-4" />,
					color: "blue",
				},
				{
					value: "done",
					displayName: "Done",
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
			options: [],
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
	asignees: User[],
): ReturnType<typeof getTaskConfig> {
	switch (key) {
		case "assignee":
			if (config.type !== "select") return config;
			const options = asignees.map((asignee) => ({
				value: asignee.username,
				displayName: asignee.username,
				icon: <UserProfilePicture src={asignee.profilePicture} />,
				color: "grey" as ColorOptions,
			}));
			return {
				...config,
				form: {
					...config.form,
					options,
				},
			};
		default:
			return config;
	}
}
