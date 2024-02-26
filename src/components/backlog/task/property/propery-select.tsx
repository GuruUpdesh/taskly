"use client";

// hooks
import React from "react";

// ui

// utils
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
import { type getPropertyConfig, taskVariants } from "~/config/TaskConfigType";
import { cn } from "~/lib/utils";
import { type NewTask } from "~/server/db/schema";

type DataCellProps = {
	config: ReturnType<typeof getPropertyConfig>;
	form: UseFormReturn<NewTask>;
	onSubmit: (newTask: NewTask) => void;
	size?: "default" | "icon";
	autoSubmit?: boolean;
};

function PropertySelect({
	config,
	form,
	onSubmit,
	size = "default",
	autoSubmit = true,
}: DataCellProps) {
	// Ensures any value is returned as a string
	const stringifyValue = (value: string | number | null): string => {
		if (value === null || value === undefined) {
			console.warn("PropertySelect: Value is null or undefined");
			return "unknown"
		};
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
		<div className="flex items-center justify-center">
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
								if (autoSubmit) void onSubmit(form.getValues());
							}}
							value={currentValue}
							defaultValue={currentValue}
						>
							<SelectTrigger
								className={cn(
									"h-min",
									size === "icon"
										? "aspect-square justify-center !p-1.5 max-h-[30px]"
										: "",
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
								onCloseAutoFocus={(e) => e.preventDefault()}
							>
								{config.options.map((option) => (
									<SelectItem
										key={stringifyValue(option.key)}
										className={cn(
											taskVariants({
												color: option.color,
												hover: true,
												context: "menu",
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
