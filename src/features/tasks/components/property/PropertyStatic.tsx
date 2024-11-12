import React from "react";

import type { UseFormReturn } from "react-hook-form";

import { type TaskFormType } from "~/features/tasks/components/CreateTask";
import { cn } from "~/lib/utils";

import { type VariantPropsType } from "../backlog/Task";

interface Props extends VariantPropsType {
	form: UseFormReturn<TaskFormType>;
	property: keyof TaskFormType;
	className?: string;
}

const PropertyStatic = ({
	form,
	property,
	variant = "backlog",
	className = "",
}: Props) => {
	return (
		<>
			{property === "description" &&
			form.watch(property) !== "" &&
			variant === "backlog" ? (
				<span className="opacity-80">{">"}</span>
			) : (
				""
			)}
			<p
				className={cn(
					"min-w-0 flex-shrink overflow-hidden text-ellipsis whitespace-nowrap px-1 font-medium",
					className,
				)}
			>
				{String(form.watch(property))}
			</p>
		</>
	);
};

export default PropertyStatic;
