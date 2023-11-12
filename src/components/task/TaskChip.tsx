import { cva, type VariantProps } from "class-variance-authority";
import React from "react";
import { cn } from "~/lib/utils";
import { BugIcon, LayoutList, Feather } from "lucide-react";
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "~/components/ui/tooltip";

// Combined variants for priority, status, and type
export const taskChipVariants = cva(
	[
		"w-fit rounded-full border px-4 flex items-center justify-center space-x-2 whitespace-nowrap flex gap-1",
	],
	{
		variants: {
			chipType: {
				priority_low: "border-gray-600 bg-gray-900 text-gray-300",
				priority_medium:
					"border-yellow-600 bg-yellow-900 text-yellow-300",
				priority_high: "border-red-600 bg-red-900 text-red-300",
				status_todo: "border-violet-600 bg-violet-900 text-violet-300",
				status_inprogress: "border-sky-600 bg-sky-900 text-sky-300",
				status_done: "border-green-600 bg-green-900 text-green-300",
				type_task: "border-violet-600 bg-violet-900 text-violet-300",
				type_bug: "border-red-600 bg-red-900 text-red-300",
				type_feature: "border-green-600 bg-green-900 text-green-300",
				null: "border-gray-600 bg-gray-900 text-gray-300",
			},
		},
		defaultVariants: {
			chipType: "null",
		},
	},
);

type TaskChipProps = VariantProps<typeof taskChipVariants>;

const TaskChip = ({ chipType }: TaskChipProps) => {
	let label, icon;

	switch (chipType) {
		case "priority_low":
			label = "Low";
			icon = null;
			break;
		case "priority_medium":
			label = "Medium";
			icon = null;
			break;
		case "priority_high":
			label = "High";
			icon = null;
			break;
		case "status_todo":
			label = "To-Do";
			icon = null;
			break;
		case "status_inprogress":
			label = "In Progress";
			icon = null;
			break;
		case "status_done":
			label = "Done";
			icon = null;
			break;
		case "type_task":
			label = "Task";
			icon = <LayoutList className="h-4 w-4" />;
			break;
		case "type_bug":
			label = "Bug";
			icon = <BugIcon className="h-4 w-4" />;
			break;
		case "type_feature":
			label = "Feature";
			icon = <Feather className="h-4 w-4" />;
			break;
		default:
			label = "null";
			icon = null;
	}

	return (
		<TooltipProvider delayDuration={250}>
			<Tooltip>
				<TooltipTrigger>
					<div className={cn(taskChipVariants({ chipType }))}>
						{icon ? <span className="h-4 w-4">{icon}</span> : null}
						{label}
					</div>
				</TooltipTrigger>
				<TooltipContent>{label}</TooltipContent>
			</Tooltip>
		</TooltipProvider>
	);
};

export default TaskChip;
