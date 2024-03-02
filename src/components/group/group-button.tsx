"use client";

import React, { useMemo } from "react";

import { Group, MinusIcon } from "lucide-react";
import { useShallow } from "zustand/react/shallow";

import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
} from "~/components/ui/select";
import { type TaskProperty, getPropertyConfig } from "~/config/TaskConfigType";
import { cn } from "~/lib/utils";
import { useAppStore } from "~/store/app";

import { Button } from "../ui/button";

const properties = [
	"status",
	"priority",
	"type",
	"assignee",
	"sprintId",
] as TaskProperty[];

const GroupButton = () => {
	const [open, setOpen] = React.useState(false);
	const [groupBy, setGroupBy, assignees, sprints] = useAppStore(
		useShallow((state) => [
			state.groupBy,
			state.setGroupBy,
			state.assignees,
			state.sprints,
		]),
	);

	const config = useMemo(() => {
		if (!groupBy) return null;
		return getPropertyConfig(groupBy, assignees, sprints);
	}, [groupBy]);

	function handleGroupChange(value: string) {
		if (value === "none") {
			setGroupBy(null);
		} else if (properties.includes(value as TaskProperty)) {
			setGroupBy(value as TaskProperty);
		} else {
			console.warn("Invalid group value");
		}
	}

	return (
		<Select
			open={open}
			onOpenChange={(open) => setOpen(open)}
			defaultValue="none"
			value={groupBy ? groupBy : "none"}
			onValueChange={(val) => handleGroupChange(val)}
		>
			<SelectTrigger
				asChild
				className="h-min border-b-0 border-l border-r-0 border-t-0 !ring-0 "
			>
				<Button
					variant="outline"
					size="sm"
					className={cn(
						"flex items-center gap-1 rounded-none border-none px-4 text-muted-foreground",
						{
							"bg-accent text-white": open,
							"bg-accent text-white hover:bg-accent/75": groupBy,
						},
					)}
				>
					<Group className="h-4 w-4" />
					{groupBy ? `Grouping by ${config?.displayName}` : "Group"}
				</Button>
			</SelectTrigger>
			<SelectContent>
				<SelectItem
					value="none"
					className="flex items-center justify-between space-x-2 !pl-2 focus:bg-accent/50"
				>
					<div className="flex min-w-[8rem] items-center gap-2">
						<span className="text-muted-foreground">
							<MinusIcon />
						</span>
						<p>No Grouping</p>
					</div>
				</SelectItem>
				{properties.map((property) => {
					const config = getPropertyConfig(
						property,
						assignees,
						sprints,
					);

					if (config.type !== "enum" && config.type !== "dynamic") {
						console.warn(
							"Grouping by non-enum or dynamic property is not supported",
						);
						return null;
					}

					return (
						<SelectItem
							key={config.key}
							value={config.key}
							className="flex items-center justify-between space-x-2 !pl-2 focus:bg-accent/50"
						>
							<div className="flex min-w-[8rem] items-center gap-2">
								<span className="text-muted-foreground">
									{config.icon}
								</span>
								<p>{config.displayName}</p>
							</div>
						</SelectItem>
					);
				})}
			</SelectContent>
		</Select>
	);
};

export default GroupButton;
