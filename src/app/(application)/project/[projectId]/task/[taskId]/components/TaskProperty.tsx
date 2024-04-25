import React from "react";

import { type VariantProps, cva } from "class-variance-authority";

import SimpleTooltip from "~/app/components/SimpleTooltip";
import {
	type Option,
	taskVariants,
	type VariantPropsType as TaskVariantsProps,
} from "~/config/taskConfigType";
import { cn } from "~/lib/utils";

const propertyVariants = cva(["flex items-center gap-2"], {
	variants: {
		size: {
			default: "px-3",
			sm: "rounded-sm px-3 text-sm",
			icon: "h-10 w-10 flex items-center justify-center rounded-full",
			iconSm: "h-6 w-6 flex items-center justify-center rounded-full",
		},
	},
	defaultVariants: {
		size: "default",
	},
});

type VariantPropsType = VariantProps<typeof propertyVariants>;

interface TaskPropertyProps extends TaskVariantsProps {
	option: Option<string>;
	className?: string;
	size?: VariantPropsType["size"];
}

const TaskProperty = ({
	option,
	size = "default",
	hover = true,
	className = "",
}: TaskPropertyProps) => {
	return (
		<SimpleTooltip label={option.displayName}>
			<div
				className={cn(
					propertyVariants({ size }),
					className,
					taskVariants({
						color: option.color,
						hover: hover,
						context: "default",
					}),
				)}
			>
				{option.icon}
				{size === "icon" || size === "iconSm"
					? null
					: option.displayName}
			</div>
		</SimpleTooltip>
	);
};

export default TaskProperty;
