"use client";

import React from "react";

import * as SelectPrimitive from "@radix-ui/react-select";
import { ChevronDown } from "lucide-react";
import { Controller, type UseFormReturn } from "react-hook-form";

import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "~/components/ui/select";
import { type getPropertyConfig, taskVariants } from "~/config/taskConfigType";
import { cn } from "~/lib/utils";

import { type TaskFormType } from "../../CreateTask";

type DataCellProps = {
	config: ReturnType<typeof getPropertyConfig>;
	form: UseFormReturn<TaskFormType>;
	onSubmit: (newTask: TaskFormType) => void;
	size?: "default" | "icon";
	autoSubmit?: boolean;
	className?: string;
	autoFocus?: boolean;
};

function PropertySelect({
	config,
	form,
	onSubmit,
	size = "default",
	autoSubmit = true,
	className = "",
	autoFocus = false,
}: DataCellProps) {
	// Ensures any value is returned as a string
	const stringifyValue = (value: string | number | null): string => {
		if (value === null || value === undefined) {
			console.warn("PropertySelect: Value is null or undefined");
			return "unknown";
		}
		return value.toString();
	};

	const getOptionByStringValue = (value: string) => {
		if (config.type !== "enum" && config.type !== "dynamic") return null;
		return config.options.find(
			(option) => stringifyValue(option.key) === value,
		);
	};

	const convertToOriginalType = (stringValue: string) => {
		const option = getOptionByStringValue(stringValue);
		if (option) return option.key;
		return stringValue;
	};

	if (config.type !== "enum" && config.type !== "dynamic") {
		console.warn("PropertySelect: Invalid config type", config.type);
		return null;
	}

	return (
		<div className={cn("flex items-center justify-center", className)}>
			<Controller
				control={form.control}
				name={config.key}
				render={({ field: { onChange, value } }) => {
					const currentValue = stringifyValue(value);
					const option = getOptionByStringValue(currentValue);

					return (
						<Select
							onValueChange={(val) => {
								onChange(convertToOriginalType(val));
								console.time("value change");
								if (autoSubmit) void onSubmit(form.getValues());
							}}
							value={currentValue}
							defaultValue={currentValue}
						>
							<SelectTrigger
								className={cn(
									"h-min overflow-hidden",
									{
										"aspect-square max-h-[30px] w-[30px] justify-center":
											size === "icon",
										"!p-1.5":
											size === "icon" &&
											config.key !== "assignee",
										"!p-0":
											size === "icon" &&
											config.key === "assignee",
									},
									taskVariants({
										color: option?.color,
										hover: true,
									}),
									"flex items-center space-x-2 whitespace-nowrap rounded-sm py-1 pl-2 pr-3",
								)}
							>
								<SelectValue asChild>
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
								onCloseAutoFocus={(e) => {
									if (!autoFocus) {
										e.preventDefault();
									}
								}}
							>
								{config.options.map((option) => (
									<SelectItem
										key={stringifyValue(option.key)}
										className={cn(
											taskVariants({
												color: option.color,
												hover: true,
											}),
											"flex items-center space-x-2 whitespace-nowrap rounded-sm border py-1 pl-2 pr-3",
											"border-none bg-transparent !pl-2",
										)}
										value={stringifyValue(option.key)}
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
