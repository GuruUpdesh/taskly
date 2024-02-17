"use client";

import React, { useRef } from "react";
import { cn } from "~/lib/utils";
import { motion } from "framer-motion";

type Props = {
	className: string;
	children: React.ReactNode;
};

const MarketingBlock = ({ className, children }: Props) => {
	const ref = useRef(null);

	const variants = {
		active: {
			transform: "translateY(0px)",
			opacity: 1,
		},
		inactive: {
			transform: "translateY(100px)",
			opacity: 0,
		},
	};

	return (
		<motion.div
			ref={ref}
			className={cn(className, "rounded-lg p-[2px]")}
			variants={variants}
			transition={{ duration: 1, ease: [0.075, 0.82, 0.165, 1] }}
		>
			<div className="flex h-full w-full flex-col gap-4 rounded-md p-4">
				{children}
			</div>
		</motion.div>
	);
};

export default MarketingBlock;
