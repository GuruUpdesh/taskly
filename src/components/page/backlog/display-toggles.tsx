"use client";

import React from "react";

import { ArrowDownNarrowWide, Filter } from "lucide-react";
import { useShallow } from "zustand/react/shallow";

import GroupButton from "~/components/group/group-button";
import { Button } from "~/components/ui/button";
import { cn } from "~/lib/utils";
import { useAppStore } from "~/store/app";

const ToggleFilters = () => {
	const [toggleFilters, isFiltersOpen] = useAppStore(
		useShallow((state) => [state.toggleFilters, state.isFiltersOpen]),
	);

	return (
		<div className="flex overflow-hidden rounded-lg border">
			<Button
				variant="outline"
				onClick={toggleFilters}
				size="sm"
				className={cn(
					"flex items-center gap-1 rounded-none border-b-0 border-l-0 border-r border-t-0 px-4",
					isFiltersOpen
						? "bg-accent hover:bg-accent/75"
						: "text-muted-foreground",
				)}
			>
				<Filter className="h-4 w-4" />
				Filter
			</Button>
			<Button
				variant="outline"
				size="sm"
				className={cn(
					"z-10 flex items-center gap-1 rounded-none border-b-0 border-l-0 border-r border-t-0 px-4 text-muted-foreground",
				)}
			>
				<ArrowDownNarrowWide className="h-4 w-4" />
				Sort
			</Button>
			<GroupButton />
		</div>
	);
};

export default ToggleFilters;
