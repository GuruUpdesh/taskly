import React from "react";

import type { UseFormReturn } from "react-hook-form";

import { cn } from "~/lib/utils";

import { type TaskFormType } from "../../create-task";

type Props = {
	form: UseFormReturn<TaskFormType>;
	property: keyof TaskFormType;
	className?: string;
};

const PropertyStatic = ({ form, property, className = "" }: Props) => {
	return (
		<>
			{property === "description" && form.watch(property) !== "" ? (
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
					},
					className,
				)}
			>
				{String(form.watch(property))}
			</p>
		</>
	);
};

export default PropertyStatic;
