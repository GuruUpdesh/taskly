import React from "react";
import type { UseFormReturn } from "react-hook-form";
import { cn } from "~/lib/utils";
import type { NewTask, Task } from "~/server/db/schema";

type Props = {
	form: UseFormReturn<Task>;
	property: keyof NewTask;
};

const PropertyStatic = ({ form, property }: Props) => {
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
				)}
			>
				{form.watch(property)}
			</p>
		</>
	);
};

export default PropertyStatic;
