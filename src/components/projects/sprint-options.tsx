"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import React from "react";
import { Controller, useForm } from "react-hook-form";
import { insertProjectSchema, type Project } from "~/server/db/schema";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "~/components/ui/select";
import { Label } from "../ui/label";
import { ChevronDown } from "lucide-react";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";

import { cn } from "~/lib/utils";
import { Button } from "~/components/ui/button";
import { Calendar } from "~/components/ui/calendar";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "~/components/ui/popover";

type Props = {
	project: Project;
};

type ProjectSprintOptions = Pick<Project, "sprintDuration" | "sprintStart">;
const ProjectSprintOptionsSchema = insertProjectSchema.required({
	sprintDuration: true,
	sprintStart: true,
});

const SprintOptions = ({ project }: Props) => {
	const { watch, setValue, control } = useForm<ProjectSprintOptions>({
		mode: "onChange",
		resolver: zodResolver(ProjectSprintOptionsSchema),
		defaultValues: {
			sprintDuration: project.sprintDuration,
			sprintStart: project.sprintStart,
		},
	});

	return (
		<form className="grid max-w-[600px] gap-4">
			<div className="grid w-full max-w-sm items-center gap-1.5">
				<Label>Sprint Duration</Label>
				<Controller
					control={control}
					name="sprintDuration"
					render={({ field: { onChange, value } }) => (
						<Select
							onValueChange={(val) => onChange(parseInt(val))}
							value={value.toString()}
						>
							<SelectTrigger>
								<SelectValue placeholder="Select Sprint Duration" />
								<ChevronDown className="ml-2 h-4 w-4" />
							</SelectTrigger>
							<SelectContent>
								<SelectItem
									value="1"
									className="flex items-center space-x-2 !pl-2"
								>
									1 Week
								</SelectItem>
								<SelectItem
									value="2"
									className="flex items-center space-x-2 !pl-2"
								>
									2 Weeks
								</SelectItem>
								<SelectItem
									value="3"
									className="flex items-center space-x-2 !pl-2"
								>
									3 Weeks
								</SelectItem>
								<SelectItem
									value="4"
									className="flex items-center space-x-2 !pl-2"
								>
									4 Weeks
								</SelectItem>
							</SelectContent>
						</Select>
					)}
				/>
			</div>
			<div className="grid w-full max-w-sm items-center gap-1.5">
				<Label>Sprint Start</Label>
				<Popover>
					<PopoverTrigger asChild>
						<Button
							variant={"outline"}
							className={cn(
								"w-full justify-between text-left font-normal",
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
							initialFocus
						/>
					</PopoverContent>
				</Popover>
			</div>
		</form>
	);
};

export default SprintOptions;
