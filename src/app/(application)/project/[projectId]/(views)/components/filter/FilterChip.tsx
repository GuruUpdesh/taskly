"use client";

import React, { useCallback, useMemo } from "react";

import { CrossCircledIcon } from "@radix-ui/react-icons";
import { Lock } from "lucide-react";
import { useShallow } from "zustand/react/shallow";

import SimpleTooltip from "~/app/components/SimpleTooltip";
import { getPropertyConfig } from "~/config/taskConfigType";
import { cn } from "~/lib/utils";
import { useAppStore, type Filter } from "~/store/app";
import { useRealtimeStore } from "~/store/realtime";
import { renderFilterValues } from "~/utils/filter-values";

import FilterMenu from "./FilterMenu";

type Props = {
	filter: Filter;
};

const FilterChip = ({ filter }: Props) => {
	const [assignees, sprints] = useRealtimeStore(
		useShallow((state) => [state.assignees, state.sprints]),
	);
	const deleteFilter = useAppStore((state) => state.deleteFilter);

	const config = useMemo(() => {
		const property = filter.property;
		if (property === "") return null;

		return getPropertyConfig(property, assignees, sprints);
	}, [assignees, sprints, filter]);

	const renderValues = useCallback(() => {
		return renderFilterValues(filter.values, config, false);
	}, [filter, filter.values, config]);

	return (
		<div className="group flex items-center justify-between overflow-hidden whitespace-nowrap rounded-full border text-sm">
			<FilterMenu defaultValues={filter} disabled={filter.locked}>
				{(menuOpen) => (
					<button
						className={cn(
							"flex h-full w-full items-center gap-2 bg-accent/25 py-1 pl-2 pr-4 transition-colors",
							{
								"bg-accent text-white": menuOpen,
								"hover:bg-accent": !filter.locked,
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
			{filter.locked ? (
				<SimpleTooltip label="This filter is locked to the view">
					<button className="border-l bg-transparent px-2 py-1.5 text-muted-foreground transition-colors group-hover:bg-background/50 group-hover:text-red-400">
						<Lock className="h-4 w-4" />
					</button>
				</SimpleTooltip>
			) : (
				<button
					onClick={() => deleteFilter(filter)}
					className="border-l bg-transparent px-2 py-1.5 text-muted-foreground transition-colors hover:text-red-400 group-hover:bg-background/50"
				>
					<CrossCircledIcon />
				</button>
			)}
		</div>
	);
};

export default FilterChip;
