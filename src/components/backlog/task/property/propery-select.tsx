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
		"rounded-sm border pl-2 pr-3 py-1 flex items-center space-x-2 whitespace-nowrap",
	],
	{
		variants: {
			color: {
				faint: "border-gray-500/50 bg-gray-800 text-gray-300/50 focus:bg-gray-700 focus:text-gray-100 hover:bg-gray-800 hover:text-gray-100",
				grey: "border-gray-700 bg-gray-900 text-gray-300 focus:bg-gray-700 focus:text-gray-100 hover:bg-gray-800 hover:text-gray-100",
				yellow: "border-yellow-700 bg-yellow-900 text-yellow-300 focus:bg-yellow-700 focus:text-yellow-100 hover:bg-yellow-800 hover:text-yellow-100",
				red: "border-red-700 bg-red-900 text-red-300 focus:bg-red-700 focus:text-red-100 hover:bg-red-800 hover:text-red-100",
				purple: "border-violet-700 bg-violet-900 text-violet-300 focus:bg-violet-700 focus:text-violet-100 hover:bg-violet-800 hover:text-violet-100",
				blue: "border-sky-700 bg-sky-900 text-sky-300 focus:bg-sky-700 focus:text-sky-100 hover:bg-sky-800 hover:text-sky-100",
				green: "border-green-700 bg-green-900 text-green-300 focus:bg-green-700 focus:text-green-100 hover:bg-green-800 hover:text-green-100",
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

function PropertySelect({
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

	// Ensures any value is returned as a string
	const stringifyValue = (value: string | number | null): string => {
		if (value === null || value === undefined) return "unassigned";
		return value.toString();
	};

	const getOptionByStringValue = (value: string) => {
		if (config.type !== "select") return null;
		return config.form?.options.find(
			(option) => stringifyValue(option.value) === value,
		);
	};

	const convertToOriginalType = (stringValue: string) => {
		const option = getOptionByStringValue(stringValue);
		if (option) return option.value;
		return stringValue === "unassigned" ? null : stringValue;
	};

	if (config.type !== "select") return null;

	return (
		<div className="flex items-center justify-center">
			<Controller
				control={form.control}
				name={col}
				render={({ field: { onChange, value } }) => {
					const currentValue = stringifyValue(value);
					const option = getOptionByStringValue(currentValue);
					const selectedOptionColor = option ? option.color : "grey";

					return (
						<Select
							onValueChange={(val) =>
								onChange(convertToOriginalType(val))
							}
							value={currentValue}
							defaultValue={currentValue}
						>
							<SelectTrigger
								className={cn(
									"h-min",
									size === "icon"
										? "aspect-square !p-1.5"
										: "",
									optionVariants({
										color: selectedOptionColor,
									}),
								)}
							>
								<SelectValue
									placeholder={config.form.placeholder}
									asChild
								>
									<span className="flex items-center gap-1">
										{option?.icon}
										{size === "icon"
											? null
											: option?.displayName}
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
										key={stringifyValue(option.value)}
										className={cn(
											optionVariants({
												color: option.color,
											}),
											"border-none bg-transparent !pl-2",
										)}
										value={stringifyValue(option.value)}
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

export default PropertySelect;
