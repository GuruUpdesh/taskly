"use client";

import { ArrowDownNarrowWide, Filter, Group } from "lucide-react";
import React from "react";
import { Button } from "~/components/ui/button";
import { cn } from "~/lib/utils";
import { useAppStore } from "~/store/app";

const ToggleFilters = () => {
	const [toggleFilters, isFiltersOpen] = useAppStore((state) => [
		state.toggleFilters,
		state.isFiltersOpen,
	]);

	return (
		<>
			<Button
				variant="outline"
				onClick={toggleFilters}
				size="sm"
				className={cn(
					"flex items-center gap-1 rounded-l-full  px-4",
					isFiltersOpen
						? "border-white/25 text-white"
						: "text-muted-foreground",
				)}
			>
				<Filter className="h-4 w-4" />
				Filter
			</Button>
			<Button
				variant="outline"
				onClick={toggleFilters}
				size="sm"
				className={cn(
					"flex items-center rounded-none gap-1 px-4",
					isFiltersOpen
						? "border-white/25 text-white"
						: "text-muted-foreground",
				)}
			>
				<ArrowDownNarrowWide className="h-4 w-4" />
				Sort
			</Button>
			<Button
				variant="outline"
				onClick={toggleFilters}
				size="sm"
				className={cn(
					"flex items-center gap-1 rounded-l-sm rounded-r-full px-4",
					isFiltersOpen
						? "border-white/25 text-white"
						: "text-muted-foreground",
				)}
			>
				<Group className="h-4 w-4" />
				Group
			</Button>
		</>
	);
};

export default ToggleFilters;
