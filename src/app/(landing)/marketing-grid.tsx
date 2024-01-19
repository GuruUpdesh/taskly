"use client";

import React, { useRef } from "react";
import { cn } from "~/lib/utils";
import { motion, useInView } from "framer-motion";
import Image from "next/image";

type Props = {
	children: React.ReactNode;
};

const MarketingGrid = ({ children }: Props) => {
	const ref = useRef(null);
	const isInView = useInView(ref, {
		amount: 0.5,
		// once: true,
	});

	const variants = {
		active: {
			transform: "rotateX(0deg)",
			backgroundColor: "transparent",
			opacity: 1,
			transition: {
				staggerChildren: 0.1,
			},
		},
		inactive: {
			transform: "rotateX(25deg)",
			backgroundColor: "hsl(var(--background))",
			opacity: 0.75,
			transition: {
				staggerChildren: 0.1,
			},
		},
	};

    const imgVariants = {
        start: {
            opacity: 1,
        },
        end: {
            opacity: 0,
        }
    };

	return (
		<>
			<motion.div
				ref={ref}
				className={cn(
					"container grid h-[850px] grid-cols-4 grid-rows-2 gap-4 rounded-lg border p-4",
				)}
				variants={variants}
				initial="inactive"
				animate={isInView ? "active" : "inactive"}
				transition={{ duration: 1, ease: [0.075, 0.82, 0.165, 1] }}
			>
				{children}
                <motion.img
                    src="/static/auth.gif"
                    alt="auth"
                    width="100%"
                    height="100%"
                    className="absolute -z-10 mix-blend-screen blur-[500px]"
                    variants={imgVariants}
                    initial="end"
                    animate={isInView ? "end" : "start"}
                />
			</motion.div>
		</>
	);
};

export default MarketingGrid;
