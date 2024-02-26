"use client";

import React, { useCallback, useMemo } from "react";

import { CrossCircledIcon } from "@radix-ui/react-icons";

import { buildDynamicOptions, getTaskConfig } from "~/config/task-entity";
import { cn } from "~/lib/utils";
import { useAppStore, type Filter } from "~/store/app";
import { renderFilterValues } from "~/utils/filter-values";

import FilterMenu from "./filter-menu";


type Props = {
	filter: Filter;
};

const FilterChip = ({ filter }: Props) => {
	const [assignees, sprints, deleteFilter] = useAppStore((state) => [
		state.assignees,
		state.sprints,
		state.deleteFilter,
	]);

	const config = useMemo(() => {
		const property = filter.property;
		if (property === "") return null;

		return buildDynamicOptions(
			getTaskConfig(property),
			property,
			assignees,
			sprints,
		);
	}, [assignees, sprints, filter]);

	const renderValues = useCallback(() => {
		return renderFilterValues(filter.values, config, false);
	}, [filter, filter.values, config]);

	return (
		<div className="group flex items-center justify-between overflow-hidden whitespace-nowrap rounded-full border text-sm">
			<FilterMenu defaultValues={filter}>
				{(menuOpen) => (
					<button
						className={cn(
							"flex h-full w-full items-center gap-2 bg-accent/25 py-1 pl-2 pr-4 transition-colors hover:bg-accent",
							{
								"bg-accent text-white": menuOpen,
							},
						)}
					>
						<span className="flex items-center gap-1">
							{config?.icon} {config?.displayName}{" "}
							{filter.is ? "is" : "is not"}
						</span>
						<span>{renderValues()}</span>
					</button>
				)}
			</FilterMenu>
			<button
				onClick={() => deleteFilter(filter)}
				className="border-l bg-transparent px-2 py-1.5 text-muted-foreground transition-colors hover:text-red-400 group-hover:bg-background/50"
			>
				<CrossCircledIcon />
			</button>
		</div>
	);
};

export default FilterChip;
