"use client";

import React from "react";

import { motion } from "framer-motion";
import { Plus } from "lucide-react";
import { useShallow } from "zustand/react/shallow";

import { cn } from "~/lib/utils";
import { useAppStore } from "~/store/app";

import FilterChip from "./FilterChip";
import FilterMenu from "./FilterMenu";

const filterContainer =
	"rounded-full border bg-accent/25 p-1 transition-all hover:bg-accent h-[30px]";

const Filters = () => {
	const [isFiltersOpen, filters] = useAppStore(
		useShallow((state) => [state.isFiltersOpen, state.filters]),
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
			className={cn("sticky top-[57px] z-50 backdrop-blur-xl", {
				"pointer-events-none": !isFiltersOpen,
			})}
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
			</div>
		</motion.div>
	);
};

export default Filters;
