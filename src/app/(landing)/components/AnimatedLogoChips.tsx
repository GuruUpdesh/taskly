"use client";

import React, { useEffect } from "react";

import { motion, useAnimation } from "framer-motion";

const animationDuration = 1;
const changeInterval = 1;

const MarketingTaskChips = () => {
	const controls1 = useAnimation();
	const controls2 = useAnimation();
	const controls3 = useAnimation();
	const controls4 = useAnimation();

	const minimum = 1;
	const maximum = 4;
	const stepSize = 1;

	useEffect(() => {
		const interval = setInterval(() => {
			void controls1.start({
				flexGrow:
					minimum +
					Math.floor(
						Math.random() * ((maximum - minimum) / stepSize),
					) *
						stepSize,
			});
			void controls2.start({
				flexGrow:
					minimum +
					Math.floor(
						Math.random() * ((maximum - minimum) / stepSize),
					) *
						stepSize,
			});
			void controls3.start({
				flexGrow:
					minimum +
					Math.floor(
						Math.random() * ((maximum - minimum) / stepSize),
					) *
						stepSize,
			});
			void controls4.start({
				flexGrow:
					minimum +
					Math.floor(
						Math.random() * ((maximum - minimum) / stepSize),
					) *
						stepSize,
			});
		}, changeInterval * 1000);

		return () => clearInterval(interval);
	}, [controls1, controls2, controls3, controls4]);

	return (
		<div className="absolute bottom-[3px] flex h-[3px] w-[60px] gap-[1px]">
			<motion.div
				className="h-[3px] flex-1 rounded-full bg-indigo-600 backdrop-blur-2xl"
				animate={controls1}
				transition={{
					duration: animationDuration,
					ease: [0.6, 0.6, 0, 1],
				}}
			/>
			<motion.div
				className="h-[3px] flex-1 rounded-full bg-red-600 backdrop-blur-2xl"
				animate={controls2}
				transition={{
					duration: animationDuration,
					ease: [0.6, 0.6, 0, 1],
				}}
			/>
			<motion.div
				className="h-[3px] flex-1 rounded-full bg-yellow-600 backdrop-blur-2xl"
				animate={controls3}
				transition={{
					duration: animationDuration,
					ease: [0.6, 0.6, 0, 1],
				}}
			/>
			<motion.div
				className="h-[3px] flex-1 rounded-full bg-green-600 backdrop-blur-2xl"
				animate={controls4}
				transition={{
					duration: animationDuration,
					ease: [0.6, 0.6, 0, 1],
				}}
			/>
		</div>
	);
};

export default MarketingTaskChips;
