"use client";

import { useEffect, useState } from "react";

import { AnimatePresence, type HTMLMotionProps, motion } from "framer-motion";

import { cn } from "~/lib/utils";

interface WordRotateProps {
	words: string[];
	duration?: number;
	framerProps?: HTMLMotionProps<"h1">;
	className?: string;
	styles?: string[];
}

export default function WordRotate({
	words,
	duration = 3000,
	framerProps = {
		initial: { y: 100 },
		animate: { y: 0 },
		exit: { y: -100 },
		transition: { duration: 0.75, ease: [0.6, 0.6, 0, 1] },
	},
	className,
	styles,
}: WordRotateProps) {
	const [index, setIndex] = useState(0);

	useEffect(() => {
		const interval = setInterval(() => {
			setIndex((prevIndex) => (prevIndex + 1) % words.length);
		}, duration);

		// Clean up interval on unmount
		return () => clearInterval(interval);
	}, [words, duration]);

	return (
		<div className="word-rotate overflow-hidden py-1">
			<AnimatePresence mode="wait" initial={false}>
				<motion.h1
					key={words[index]}
					className={cn(className, styles ? styles[index] : "")}
					{...framerProps}
				>
					{words[index]}
				</motion.h1>
			</AnimatePresence>
		</div>
	);
}
