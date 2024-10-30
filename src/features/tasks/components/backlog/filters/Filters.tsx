"use client";

import React from "react";

import { motion } from "framer-motion";
import { Plus, X } from "lucide-react";
import { useShallow } from "zustand/react/shallow";

import FilterViewsToggleButton from "~/features/tasks/components/backlog/filters/FilterViewsToggleButton";
import { filteredTaskViews } from "~/features/tasks/config/filteredTaskViews";
import { cn } from "~/lib/utils";
import { useAppStore } from "~/store/app";

import FilterChip from "./FilterChip";
import FilterMenu from "./FilterMenu";
import { Button } from "~/components/ui/button";

const filterContainer =
	"rounded-full border bg-accent/25 p-1 transition-all hover:bg-accent h-[30px]";

type Props = {
	username?: string | null;
};

const Filters = ({ username }: Props) => {
	const [toggleFilters, isFiltersOpen, filters] = useAppStore(
		useShallow((state) => [
			state.toggleFilters,
			state.isFiltersOpen,
			state.filters,
		]),
	);

	const variants = {
		open: { opacity: 1, height: "auto" },
		closed: { opacity: 0, height: 0 },
	};

	return (
		<motion.div
			initial="closed"
			animate={isFiltersOpen ? "open" : "closed"}
			variants={variants}
			transition={{ duration: 0.2, ease: [0.075, 0.82, 0.165, 1] }}
			className={cn(
				"sticky top-[57px] z-20 border-b bg-background/75 backdrop-blur-xl",
				{
					"pointer-events-none": !isFiltersOpen,
				},
			)}
		>
			<div className="flex flex-wrap items-center gap-2 px-4 py-2 text-muted-foreground">
				<p>Filters:</p>
				{filters.map((filter, idx) => (
					<FilterChip key={idx} filter={filter} />
				))}
				<FilterMenu>
					{(menuOpen) => (
						<div>
							<button
								className={cn(
									filterContainer,
									"flex aspect-square items-center justify-center",
									{
										"bg-accent text-white": menuOpen,
									},
								)}
							>
								<Plus className="h-4 w-4" />
							</button>
						</div>
					)}
				</FilterMenu>
				<div className="flex-1" />
				<div className="overflow-hidden rounded-lg border">
					<FilterViewsToggleButton
						label={"All"}
						username={username}
					/>
					{filteredTaskViews.map((view) => (
						<FilterViewsToggleButton
							key={view.label}
							label={view.label}
							filters={view.filters}
							username={username}
						/>
					))}
				</div>
				<Button variant="ghost" size="iconSm" onClick={toggleFilters}>
					<X className="h-4 w-4" />
					<span className="sr-only">Toggle Filters</span>
				</Button>
			</div>
		</motion.div>
	);
};

export default Filters;
