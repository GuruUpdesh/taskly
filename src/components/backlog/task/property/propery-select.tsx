"use client";

// hooks
import React, { useEffect } from "react";

// ui
import { Controller, type UseFormReturn } from "react-hook-form";
import { type NewTask } from "~/server/db/schema";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "~/components/ui/select";

// utils
import { type buildDynamicOptions } from "~/entities/task-entity";
import { cva } from "class-variance-authority";
import { cn } from "~/lib/utils";

export const optionVariants = cva(
	[
		"rounded-sm border pl-2 pr-3 py-1 flex items-center space-x-2 whitespace-nowrap flex",
	],
	{
		variants: {
			color: {
				grey: "border-gray-700 bg-gray-900 text-gray-300 focus:bg-gray-700 focus:text-gray-100",
				yellow: "border-yellow-700 bg-yellow-900 text-yellow-300 focus:bg-yellow-700 focus:text-yellow-100",
				red: "border-red-700 bg-red-900 text-red-300 focus:bg-red-700 focus:text-red-100",
				purple: "border-violet-700 bg-violet-900 text-violet-300 focus:bg-violet-700 focus:text-violet-100",
				blue: "border-sky-700 bg-sky-900 text-sky-300 focus:bg-sky-700 focus:text-sky-100 ",
				green: "border-green-700 bg-green-900 text-green-300 focus:bg-green-700 focus:text-green-100",
			},
		},
		defaultVariants: {
			color: "grey",
		},
	},
);

type DataCellProps = {
	config: ReturnType<typeof buildDynamicOptions>;
	col: keyof NewTask;
	form: UseFormReturn<NewTask>;
	onSubmit: (newTask: NewTask) => void;
	isNew: boolean;
};

function DataCellSelect({ config, col, form, onSubmit, isNew }: DataCellProps) {
	useEffect(() => {
		if (isNew) return;
		void onSubmit(form.getValues());
	}, [form.watch(col)]);

	// get selected option
	function getSelectedOption(value: string) {
		if (config.type !== "select") return "grey";

		const selectedOption = config.form?.options.find(
			(option) => option.value === value,
		);

		if (!selectedOption) return "grey";
		return selectedOption.color;
	}

	if (config.type !== "select") return null;

	return (
		<div className="flex items-center justify-center">
			<Controller
				control={form.control}
				name={col}
				render={({ field: { onChange, value } }) => {
					return (
						<Select
							onValueChange={onChange}
							value={value ? value.toString() : ""}
							defaultValue={value ? value.toString() : ""}
						>
							<SelectTrigger
								className={cn(
									"h-min",
									optionVariants({
										color: getSelectedOption(
											value ? value.toString() : "",
										),
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
										key={option.value}
										className={cn(
											"mb-2",
											optionVariants({
												color: option.color,
											}),
										)}
										value={
											option.value
												? option.value.toString()
												: ""
										}
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
					);
				}}
			/>
		</div>
	);
}

export default DataCellSelect;
