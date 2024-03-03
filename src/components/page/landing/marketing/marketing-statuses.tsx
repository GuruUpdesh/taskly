"use client";

import React, { useEffect, useRef } from "react";

import { motion } from "framer-motion";

import { type Task } from "~/server/db/schema";

import { TaskStatus } from "../../project/recent-tasks";

function getPositionOnOval(angle: number, width: number, height: number) {
	const x = (width / 2) * Math.cos(angle) + width / 2;
	const y = (height / 2) * Math.sin(angle) + height / 2;
	return { x, y };
}

const MarketingStatuses = () => {
	const statuses = [
		"inprogress",
		"backlog",
		"done",
		"inreview",
		"todo",
		"inprogress",
		"backlog",
		"done",
		"inreview",
		"todo",
		"inprogress",
		"backlog",
		"done",
		"inreview",
		"todo",
		"inprogress",
		"backlog",
		"done",
		"inreview",
		"todo",
	];
	const containerRef = useRef<HTMLDivElement | null>(null);

	useEffect(() => {
		if (containerRef.current) {
			const { clientWidth: width, clientHeight: height } =
				containerRef.current;
			const children = Array.from(
				containerRef.current.children,
			) as HTMLElement[];
			children.forEach((child, index) => {
				const angle = (2 * Math.PI * index) / children.length;
				const { x, y } = getPositionOnOval(angle, width, height);
				child.style.transform = `translate(${x}px, ${y}px)`;
			});
		}
	}, []);

	return (
		<div className="fixed top-0 z-50 h-full w-full" ref={containerRef}>
			{statuses.map((status, index) => (
				<div key={index}>
					<motion.div
						animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
						transition={{
							duration: 1,
							loop: Infinity,
							ease: "easeInOut",
						}}
					>
						<TaskStatus status={status as Task["status"]} />
					</motion.div>
				</div>
			))}
		</div>
	);
};

export default MarketingStatuses;
