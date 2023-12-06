"use client";

import React, { useEffect, useRef } from "react";

// ui
import { TableCell } from "~/components/ui/table";
import { Input } from "~/components/ui/input";
import {
	Controller,
	ControllerRenderProps,
	UseFormReturn,
} from "react-hook-form";
import { NewTask } from "~/server/db/schema";
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "~/components/ui/tooltip";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "~/components/ui/select";
import {
	EntityConfigFormSelectOption,
	EntityFieldConfig,
} from "~/entities/entityTypes";
import { getTaskConfig } from "~/entities/task-entity";
import { cva } from "class-variance-authority";
import { cn } from "~/lib/utils";
import { options } from "prettier-plugin-tailwindcss";

export const optionVariants = cva(
	[
		"rounded-full border pl-2 pr-3 py-1 flex items-center space-x-2 whitespace-nowrap flex",
	],
	{
		variants: {
			color: {
				grey: "border-gray-600 bg-gray-900 text-gray-300 focus:bg-gray-800 focus:border-gray-300 focus:text-gray-200",
				yellow: "border-yellow-600 bg-yellow-900 text-yellow-300 focus:bg-yellow-800 focus:border-yellow-300 focus:text-yellow-200",
				red: "border-red-600 bg-red-900 text-red-300 focus:bg-red-800 focus:border-red-300 focus:text-red-200",
				purple: "border-violet-600 bg-violet-900 text-violet-300 focus:bg-violet-800 focus:border-violet-300 focus:text-violet-200",
				blue: "border-sky-600 bg-sky-900 text-sky-300 focus:bg-sky-800 focus:border-sky-300 focus:text-sky-200 ",
				green: "border-green-600 bg-green-900 text-green-300 focus:text-green-200 focus:bg-green-800 focus:border-green-300",
			},
		},
		defaultVariants: {
			color: "grey",
		},
	},
);

type DataCellProps = {
	config: ReturnType<typeof getTaskConfig>;
	col: keyof NewTask;
	form: UseFormReturn<NewTask>;
	onSubmit: (newTask: NewTask) => Promise<void>;
	isNew: boolean;
	autoFocus?: boolean;
};

function DataCellSelect({ config, col, form, onSubmit, isNew, autoFocus=false }: DataCellProps) {

	useEffect(() => {
		if (isNew) return;

		console.log(`WATCHTOWER(${col})`, form.watch(col), "current", form.getValues());
		onSubmit(form.getValues());
	}, [form.watch(col)]);

	if (config.type !== "select") return null;

	function getSelectedOption(value: string) {
		if (config.type !== "select") return "grey";

		const selectedOption = config.form?.options.find(
			(option) => option.value === value,
		);
		if (!selectedOption) return "grey";
		return selectedOption.color;
	}

	return (
		<TableCell className="border p-0">
			<div className="flex items-center justify-center px-2">
				<Controller
					control={form.control}
					name={col}
					render={({ field }) => (
						<Select
							onValueChange={(value) => field.onChange(value)}
							defaultValue={field.value}
						>
							<SelectTrigger
								className={cn(
									"h-min",
									optionVariants({
										color: getSelectedOption(field.value),
									}),
								)}
							>
								<SelectValue
									placeholder={config.form.placeholder}
								/>
							</SelectTrigger>
							<SelectContent>
								{config.form?.options.map((option) => (
									<SelectItem
										className={cn("mb-2",
											optionVariants({
												color: option.color,
											})
										)}
										value={option.value as string}
									>
										<div className="flex items-center gap-1">
											<span className="">
												{option.icon}
											</span>
											<p>{option.displayName}</p>
										</div>
									</SelectItem>
								))}
							</SelectContent>
						</Select>
					)}
				/>
			</div>
		</TableCell>
	);
}

export default DataCellSelect;
