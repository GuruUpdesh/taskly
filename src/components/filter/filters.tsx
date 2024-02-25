"use client";

import React from "react";
import { useAppStore } from "~/store/app";
import { motion } from "framer-motion";
import FilterChip from "./filter-chip";
import FilterMenu from "./filter-menu";
import { cn } from "~/lib/utils";
import { Plus } from "lucide-react";

const filterContainer =
	"rounded-full border bg-accent/25 p-1 transition-all hover:bg-accent";

const Filters = () => {
	const [isFiltersOpen, filters] = useAppStore((state) => [
		state.isFiltersOpen,
		state.filters,
	]);

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
		>
			<div className="flex flex-wrap items-center gap-2 bg-gradient-to-b from-accent/25 to-transparent px-4 py-2 text-muted-foreground">
				{filters.map((filter, idx) => (
					<FilterChip key={idx} filter={filter} />
				))}
				<FilterMenu>
					{(menuOpen) => (
						<button
							className={cn(filterContainer, {
								"bg-accent text-white": menuOpen,
							})}
						>
							<Plus className="h-4 w-4" />
						</button>
					)}
				</FilterMenu>
			</div>
		</motion.div>
	);
};

export default Filters;
