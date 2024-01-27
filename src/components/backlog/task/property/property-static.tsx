import React from "react";
import type { UseFormReturn } from "react-hook-form";
import { cn } from "~/lib/utils";
import type { NewTask } from "~/server/db/schema";

type Props = {
	form: UseFormReturn<NewTask>;
	property: keyof NewTask;
};

const PropertyStatic = ({ form, property }: Props) => {
	return (
		<>
			<p
				className={cn("w-min flex-grow-0 whitespace-nowrap px-4", {
					"opacity-80": property === "description",
					"font-medium": property === "title",
				})}
			>
				{form.watch(property)}
			</p>
		</>
	);
};

export default PropertyStatic;
