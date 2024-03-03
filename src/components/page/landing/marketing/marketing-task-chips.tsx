"use client";

import React, { useEffect } from "react";

import { motion, useAnimation } from "framer-motion";

const MarketingTaskChips = () => {
	const controls1 = useAnimation();
	const controls2 = useAnimation();
	const controls3 = useAnimation();
	const controls4 = useAnimation();

	useEffect(() => {
		const interval = setInterval(() => {
			void controls1.start({ flexGrow: Math.random() * 4 });
			void controls2.start({ flexGrow: Math.random() * 4 });
			void controls3.start({ flexGrow: Math.random() * 4 });
			void controls4.start({ flexGrow: Math.random() * 4 });
		}, 2000);

		return () => clearInterval(interval);
	}, [controls1, controls2, controls3, controls4]);

	return (
		<div className="-z-10 flex h-[10px] w-full max-w-[1000px] gap-4">
			<motion.div
				className="h-[10px] flex-1 rounded-full bg-indigo-800"
				animate={controls1}
				transition={{ duration: 1.75, ease: [0.075, 0.82, 0.165, 1] }}
			/>
			<motion.div
				className="h-[10px] flex-1 rounded-full bg-red-800"
				animate={controls2}
				transition={{ duration: 1.75, ease: [0.075, 0.82, 0.165, 1] }}
			/>
			<motion.div
				className="h-[10px] flex-1 rounded-full bg-yellow-600"
				animate={controls3}
				transition={{ duration: 1.75, ease: [0.075, 0.82, 0.165, 1] }}
			/>
			<motion.div
				className="h-[10px] flex-1 rounded-full bg-green-600"
				animate={controls4}
				transition={{ duration: 1.75, ease: [0.075, 0.82, 0.165, 1] }}
			/>
		</div>
	);
};

export default MarketingTaskChips;
