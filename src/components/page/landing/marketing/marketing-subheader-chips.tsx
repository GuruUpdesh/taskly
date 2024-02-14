"use client";

import React from "react";
import { cn } from "~/lib/utils";
import { motion } from "framer-motion";

type Props = {
	plexSans: string;
};

const MarketingSubHeaderChips = ({ plexSans }: Props) => {
	const variants = {
		start: {
			opacity: 0,
			y: 20,
		},
		end: {
			opacity: 1,
			y: 0,
		},
	};

	return (
		<motion.div
			className="mt-4 flex items-center justify-between"
			variants={variants}
			initial="start"
			animate="end"
			transition={{
				staggerChildren: 0.05,
				duration: 0.1,
				ease: [0.175, 0.885, 0.32, 1.275],
			}}
		>
			<motion.span
				className={cn(
					plexSans,
					"rounded-full border bg-accent px-2 font-light",
				)}
				variants={variants}
			>
				Made Simple
			</motion.span>
			<motion.span
				className={cn(
					plexSans,
					"rounded-full border bg-accent px-2 font-light",
				)}
				variants={variants}
			>
				For Everyone
			</motion.span>
			<motion.span
				className={cn(
					plexSans,
					"rounded-full border bg-accent px-2 font-light",
				)}
				variants={variants}
			>
				With Taskly
			</motion.span>
		</motion.div>
	);
};

export default MarketingSubHeaderChips;
