"use client";

import React from "react";

import { endOfYesterday, format } from "date-fns";
import { ChevronDown } from "lucide-react";
import { Calendar as CalendarIcon } from "lucide-react";
import { Controller, type UseFormReturn } from "react-hook-form";

import type { CreateForm } from "~/actions/onboarding/create-project";
import { Button } from "~/components/ui/button";
import { Calendar } from "~/components/ui/calendar";
import { Label } from "~/components/ui/label";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "~/components/ui/popover";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "~/components/ui/select";
import { cn } from "~/lib/utils";

import type { ProjectSprintOptions } from "./sprint-options-form";


type Props = {
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	form: UseFormReturn<ProjectSprintOptions | CreateForm>;
	hidden?: boolean;
};

const SprintOptions = ({ form, hidden = false }: Props) => {
	const { watch, setValue, control } = form;

	return (
		<div className={cn("grid w-full gap-4", hidden && "hidden")}>
			<div className="flex w-full items-center justify-between gap-8">
				<Label className={"whitespace-nowrap font-bold"}>
					Sprint Duration
				</Label>
				<Controller
					control={control}
					name="sprintDuration"
					render={({ field: { onChange, value } }) => (
						<Select
							onValueChange={(val) => onChange(parseInt(val))}
							value={value.toString()}
						>
							<SelectTrigger className="max-w-[400px]">
								<SelectValue placeholder="Select Sprint Duration" />
								<ChevronDown className="ml-2 h-4 w-4" />
							</SelectTrigger>
							<SelectContent>
								<SelectItem
									value="1"
									className="flex items-center justify-between space-x-2 !pl-2 focus:bg-accent/50"
								>
									1 Week
								</SelectItem>
								<SelectItem
									value="2"
									className="flex items-center justify-between space-x-2 !pl-2 focus:bg-accent/50"
								>
									2 Weeks
								</SelectItem>
								<SelectItem
									value="3"
									className="flex items-center justify-between space-x-2 !pl-2  focus:bg-accent/50"
								>
									3 Weeks
								</SelectItem>
								<SelectItem
									value="4"
									className="flex items-center justify-between space-x-2 !pl-2 focus:bg-accent/50"
								>
									4 Weeks
								</SelectItem>
							</SelectContent>
						</Select>
					)}
				/>
			</div>
			<div className="flex w-full items-center justify-between gap-8">
				<Label className="font-bold">Sprint Start</Label>
				<Popover>
					<PopoverTrigger asChild>
						<Button
							variant={"outline"}
							className={cn(
								"w-full max-w-[400px] justify-between text-left font-normal",
								!watch("sprintStart") &&
									"text-muted-foreground",
							)}
						>
							<div className="flex items-center">
								<CalendarIcon className="mr-2 h-4 w-4" />
								{watch("sprintStart") ? (
									format(watch("sprintStart"), "PPP")
								) : (
									<span>Pick a date</span>
								)}
							</div>
							<ChevronDown className="ml-2 h-4 w-4" />
						</Button>
					</PopoverTrigger>
					<PopoverContent className="w-auto p-0">
						<Calendar
							mode="single"
							selected={watch("sprintStart")}
							onSelect={(val) => {
								console.log(val);
								if (val instanceof Date) {
									setValue("sprintStart", val);
								}
							}}
							disabled={{
								from: new Date("0001-01-01T00:00:00Z"),
								to: endOfYesterday(),
							}}
							initialFocus
						/>
					</PopoverContent>
				</Popover>
			</div>
		</div>
	);
};

export default SprintOptions;
