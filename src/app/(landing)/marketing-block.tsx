"use client";

import React, { useRef } from "react";
import { cn } from "~/lib/utils";
import { motion, useInView } from "framer-motion";

type Props = {
	className: string;
    amount?: number;
};

const MarketingBlock = ({ className, amount=0.9 }: Props) => {
	const ref = useRef(null);
	// const isInView = useInView(ref, {
	// 	amount: amount,
    //     // once: true,
	// });

	const variants = {
        active: {
            transform: "translateY(0px)",
            // backgroundColor: "red",
            opacity: 1,

        },
        inactive: {
            transform: "translateY(100px)",
            // backgroundColor: "rgba(0,0,0,0.75)",
            opacity: 0,
        },
	};

	return (
		<motion.div
			ref={ref}
			className={cn(className, "rounded-lg p-[2px]")}
			variants={variants}
            transition={{ duration: 1, ease: [0.075, 0.82, 0.165, 1] }}
            // initial="inactive"
			// animate={isInView ? "active" : "inactive"}
		>
			<div className="h-full w-full rounded-md bg-gradient-to-t from-black/50 to-black/25"></div>
		</motion.div>
	);
};

export default MarketingBlock;
