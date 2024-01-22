"use client";

import React from "react";
import { Button } from "../ui/button";
import Link from "next/link";
import { motion } from "framer-motion";
import { ChevronRight } from "lucide-react";

const ButtonOptions = () => {
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
			className="flex items-center justify-center gap-12 py-12"
			variants={variants}
			initial="start"
			animate="end"
			transition={{
				staggerChildren: 0.1,
				duration: 0.1,
				ease: [0.175, 0.885, 0.32, 1.275],
			}}
		>
			<motion.div variants={variants}>
				<Button size="lg" variant="secondary">
					Learn More
				</Button>
			</motion.div>
			<motion.div variants={variants}>
				<Button size="lg" variant="secondary">
					Documentation
				</Button>
			</motion.div>
			<motion.div variants={variants}>
				<Link href="/app">
					<Button size="lg" className="gap-2 font-bold">
						Get Started <ChevronRight className="h-4 w-4" />
					</Button>
				</Link>
			</motion.div>
		</motion.div>
	);
};

export default ButtonOptions;
