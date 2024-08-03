"use client";

import { useEffect, useState } from "react";

import { AnimatePresence, type HTMLMotionProps, motion } from "framer-motion";

import { cn } from "~/lib/utils";

interface WordRotateProps {
	words: string[];
	duration?: number;
	framerProps?: HTMLMotionProps<"h1">;
	className?: string;
}

export default function WordRotate({
	words,
	duration = 3000,
	framerProps = {
		initial: { opacity: 0, y: -50 },
		animate: { opacity: 1, y: 0 },
		exit: { opacity: 0, y: 50 },
		transition: { duration: 0.5, ease: [0.6, 0.6, 0, 1] },
	},
	className,
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
		<div className="overflow-hidden py-2">
			<AnimatePresence mode="wait">
				<motion.h1
					key={words[index]}
					className={cn(className, {
						"from-indigo-300 to-indigo-700": index === 0,
						"from-red-300 to-red-700": index === 1,
						"from-yellow-300 to-yellow-700": index === 2,
						"from-green-300 to-green-700": index === 3,
					})}
					{...framerProps}
				>
					{words[index]}
				</motion.h1>
			</AnimatePresence>
		</div>
	);
}
