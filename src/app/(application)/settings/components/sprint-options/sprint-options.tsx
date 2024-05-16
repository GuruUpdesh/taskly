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
				<div className="mr-8 space-y-0.5">
					<Label className={"whitespace-nowrap font-bold"}>
						Sprint Duration
					</Label>
					<p className="text-sm text-muted-foreground">
						The duration of each sprint in the project
					</p>
				</div>
				<Controller
					control={control}
					name="sprintDuration"
					render={({ field: { onChange, value } }) => (
						<Select
							onValueChange={(val) => onChange(parseInt(val))}
							value={value.toString()}
						>
							<SelectTrigger className="max-w-[200px] border-none bg-transparent hover:bg-accent">
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
				<div className="mr-8 space-y-0.5">
					<Label className={"whitespace-nowrap font-bold"}>
						Start Date
					</Label>
					<p className="text-sm text-muted-foreground">
						The first day of the first sprint
					</p>
				</div>
				<Popover>
					<PopoverTrigger asChild>
						<Button
							variant={"outline"}
							className={cn(
								"w-full max-w-[200px] justify-between border-none bg-transparent text-left font-normal",
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
