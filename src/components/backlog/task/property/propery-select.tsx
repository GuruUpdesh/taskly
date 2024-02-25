"use client";

// hooks
import React from "react";

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
import { type buildDynamicOptions } from "~/config/task-entity";
import { cn } from "~/lib/utils";
import * as SelectPrimitive from "@radix-ui/react-select";
import { ChevronDown } from "lucide-react";
import { optionVariants } from "~/config/task-entity";

type DataCellProps = {
	config: ReturnType<typeof buildDynamicOptions>;
	col: keyof NewTask;
	form: UseFormReturn<NewTask>;
	onSubmit: (newTask: NewTask) => void;
	size?: "default" | "icon";
	autoSubmit?: boolean;
};

function PropertySelect({
	config,
	col,
	form,
	onSubmit,
	size = "default",
	autoSubmit = true,
}: DataCellProps) {
	// const initialRender = useRef(true)
	// useEffect(() => {
	// 	console.log("watching", col);
	// 	if (isNew || initialRender.current) {
	//         initialRender.current = false;
	//         return;
	//     }
	// 	void onSubmit(form.getValues());
	// }, [form.watch(col), initialRender.current]);

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
					const currentValue =
						value instanceof Date
							? value.toISOString()
							: stringifyValue(value);
					const option = getOptionByStringValue(currentValue);
					const selectedOptionColor = option ? option.color : "grey";

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
										? "aspect-square !p-1.5"
										: "",
									optionVariants({
										color: selectedOptionColor,
									}),
									"flex items-center space-x-2 whitespace-nowrap rounded-sm border py-1 pl-2 pr-3",
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
											"flex items-center space-x-2 whitespace-nowrap rounded-sm border py-1 pl-2 pr-3",
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
