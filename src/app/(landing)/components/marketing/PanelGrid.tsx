"use client";

import React, { useRef } from "react";

import { motion, useInView } from "framer-motion";

import { cn } from "~/lib/utils";

type Props = {
	children: React.ReactNode;
};

const MarketingGrid = ({ children }: Props) => {
	const ref = useRef<HTMLDivElement | null>(null);
	// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call
	const isInView = useInView(ref, {
		amount: 1,
		once: true,
	});

	const variants = {
		active: {
			transform: "rotateX(0deg)",
			backgroundColor: "bg-transparent",
			transition: {
				staggerChildren: 0.1,
			},
		},
		inactive: {
			transform: "rotateX(25deg)",
			backgroundColor: "bg-transparent",
			transition: {
				staggerChildren: 0.1,
			},
		},
	};

	return (
		<>
			<motion.div
				ref={ref}
				className={cn(
					"container grid h-full grid-cols-4 grid-rows-2 gap-4 rounded-lg border p-4 shadow-xl backdrop-blur-xl",
				)}
				variants={variants}
				initial="inactive"
				animate={isInView ? "active" : "inactive"}
				transition={{ duration: 1, ease: [0.075, 0.82, 0.165, 1] }}
			>
				{children}
			</motion.div>
		</>
	);
};

export default MarketingGrid;
