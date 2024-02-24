"use client";

import React from "react";
import { useAppStore } from "~/store/app";
import { motion } from "framer-motion";
import AddFilter from "./add-filter";
import { type Sprint, type User } from "~/server/db/schema";

const filterContainer = "rounded-full border bg-accent/25 p-1 transition-all hover:bg-accent";

type Props = {
	assignees: User[];
	sprints: Sprint[];
};

const Filters = ({ assignees, sprints }: Props) => {
	const isFiltersOpen = useAppStore((state) => state.isFiltersOpen);

	// Define animation variants
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
			<div className="flex items-center gap-2 bg-gradient-to-b from-accent/25 to-transparent px-4 py-2 text-muted-foreground hover:text-white">
				<div className="grid-col-3 flex items-center justify-between gap-1 whitespace-nowrap rounded-full border bg-accent/25 px-4 py-1 text-sm transition-all hover:bg-accent">
					Status is Backlog
				</div>
				<AddFilter containerClass={filterContainer} assignees={assignees} sprints={sprints}/>
			</div>
		</motion.div>
	);
};

export default Filters;
