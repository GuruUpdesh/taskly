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
export const projectChipVariants = cva(
	[
		"w-fit rounded-full border px-4 flex items-center justify-center space-x-2 whitespace-nowrap flex gap-1",
	],
	{
		variants: {
			chipType: {
				status_active: "border-green-600 bg-green-900 text-green-300",
				status_inactive: "border-red-600 bg-red-900 text-red-300",
				null: "border-gray-600 bg-gray-900 text-gray-300",
			},
		},
		defaultVariants: {
			chipType: "null",
		},
	},
);

type ProjectChipProps = VariantProps<typeof projectChipVariants>;

const ProjectChip = ({ chipType }: ProjectChipProps) => {
	let label, icon;

	switch (chipType) {
		case "status_active":
			label = "Active";
			icon = null;
			break;
		case "status_inactive":
			label = "Inactive";
			icon = null;
			break;
		default:
			label = "null";
			icon = null;
	}

	return (
		<TooltipProvider delayDuration={250}>
			<Tooltip>
				<TooltipTrigger>
					<div className={cn(projectChipVariants({ chipType }))}>
						{icon ? <span className="h-4 w-4">{icon}</span> : null}
						{label}
					</div>
				</TooltipTrigger>
				<TooltipContent>{label}</TooltipContent>
			</Tooltip>
		</TooltipProvider>
	);
};

export default ProjectChip;
