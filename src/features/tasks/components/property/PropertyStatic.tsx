import React from "react";

import markdownToTxt from "markdown-to-txt";
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
					"flex-shrink overflow-hidden text-ellipsis whitespace-nowrap px-1 ",
					{
						"min-w-[2ch] opacity-80": property === "description",
						"min-w-fit font-medium": property === "title",
						"min-w-0": property === "title",
					},
					className,
				)}
			>
				{property === "description"
					? markdownToTxt(String(form.watch(property)))
					: String(form.watch(property))}
			</p>
		</>
	);
};

export default PropertyStatic;
