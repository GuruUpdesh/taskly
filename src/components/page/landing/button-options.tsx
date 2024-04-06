"use client";

import React from "react";

import { motion } from "framer-motion";
import { ChevronRight } from "lucide-react";
import Link from "next/link";

import SimpleTooltip from "~/components/general/simple-tooltip";
import { Button } from "~/components/ui/button";

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
			className="flex items-center justify-center gap-4 py-3 md:py-4 lg:gap-12 lg:py-6"
			variants={variants}
			initial="start"
			animate="end"
			transition={{
				staggerChildren: 0.1,
				duration: 0.1,
				ease: [0.175, 0.885, 0.32, 1.275],
			}}
		>
			<motion.div variants={variants} className="hidden md:block">
				<Button
					variant="outline"
					className="white rounded-full bg-transparent backdrop-blur-lg"
					disabled={true}
				>
					Watch a Demo
				</Button>
			</motion.div>
			<motion.div variants={variants} className="hidden sm:block">
				<SimpleTooltip label="Coming Soon">
					<Button
						variant="outline"
						className="rounded-full bg-transparent backdrop-blur-lg"
					>
						Documentation
					</Button>
				</SimpleTooltip>
			</motion.div>
			<motion.div variants={variants}>
				<Link href="/app">
					<Button className="gap-2 rounded-full font-bold hover:bg-green-500 hover:text-foreground">
						Get Started <ChevronRight className="h-4 w-4" />
					</Button>
				</Link>
			</motion.div>
		</motion.div>
	);
};

export default ButtonOptions;
