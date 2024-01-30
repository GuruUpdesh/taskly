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
import * as SelectPrimitive from "@radix-ui/react-select";
import { ChevronDown } from "lucide-react";

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
	size?: "default" | "icon";
};

function DataCellSelect({
	config,
	col,
	form,
	onSubmit,
	isNew,
	size = "default",
}: DataCellProps) {
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

	function getOption(value: string) {
		if (config.type !== "select") return null;

		const option = config.form?.options.find(
			(option) => option.value === value,
		);

		return option;
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
							value={value ? value.toString() : "unassigned"}
							defaultValue={
								value ? value.toString() : "unassigned"
							}
						>
							<SelectTrigger
								className={cn(
									"h-min",
									size === "icon"
										? "aspect-square !p-1.5"
										: "",
									optionVariants({
										color: getSelectedOption(
											value
												? value.toString()
												: "unassigned",
										),
									}),
								)}
							>
								<SelectValue
									placeholder={config.form.placeholder}
									asChild
								>
									<span className="flex items-center gap-1">
										{
											getOption(
												value
													? value.toString()
													: "unassigned",
											)?.icon
										}
										{size === "icon"
											? null
											: getOption(
													value
														? value.toString()
														: "unassigned",
												)?.displayName}
									</span>
								</SelectValue>
								{size === "icon" ? null : (
									<SelectPrimitive.Icon asChild>
										<ChevronDown className="h-4 w-4 opacity-50" />
									</SelectPrimitive.Icon>
								)}
							</SelectTrigger>
							<SelectContent
								onCloseAutoFocus={(e) => e.preventDefault()}
							>
								{config.form?.options.map((option) => (
									<SelectItem
										key={option.value}
										className={cn(
											optionVariants({
												color: option.color,
											}),
											"border-none bg-transparent !pl-2",
										)}
										value={
											option.value
												? option.value.toString()
												: ""
										}
									>
										<div className="flex min-w-[8rem] items-center gap-2">
											<span>{option.icon}</span>
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