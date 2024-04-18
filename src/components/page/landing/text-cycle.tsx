"use client";

import React, { useEffect, useRef } from "react";

import { motion, useAnimation } from "framer-motion";

function generateAnimationFrames(padding: number, children: HTMLCollection) {
	let totalHeight = 0;
	const frames = [];
	for (const child of children) {
		const height = child.clientHeight;
		const frame = (totalHeight + padding) * -1;
		frames.push(frame);
		frames.push(frame);
		totalHeight += height;
	}
	frames.pop();
	return frames;
}

const TextCycle = () => {
	const containerRef = useRef<HTMLDivElement>(null);
	const cycleRef = useRef<HTMLDivElement>(null);
	const cycleControls = useAnimation();

	useEffect(() => {
		function handleResize() {
			const container = containerRef.current;
			const cycle = cycleRef.current;
			const children = cycle?.children;

			if (!container || !cycle || !children) return;
			const textHeight = cycle.clientHeight / children.length;
			container.style.height = `${textHeight}px`;

			const padding = 16;
			cycle.style.setProperty("--padding-y", `${padding}px`);
			void cycleControls.start({
				translateY: [...generateAnimationFrames(padding, children)],
				transition: {
					duration: 10,
					repeat: Infinity,
					ease: [0.6, 0.6, 0, 1],
				},
			});
		}

		handleResize();

		window.addEventListener("resize", handleResize);
		return () => window.removeEventListener("resize", handleResize);
	}, [cycleRef, containerRef]);

	return (
		<div className="cycle-text-container" ref={containerRef}>
			<motion.div
				className="cycle-text"
				ref={cycleRef}
				animate={cycleControls}
			>
				<p className="bg-gradient-to-r from-indigo-300 to-indigo-700 bg-clip-text tracking-tighter text-transparent">
					agile project management
				</p>
				<p className="bg-gradient-to-r from-red-300 to-red-700 bg-clip-text tracking-tighter text-transparent">
					collaboration and teamwork
				</p>
				<p className="bg-gradient-to-r from-yellow-300 to-yellow-700 bg-clip-text tracking-tighter text-transparent">
					task creation and sprints
				</p>
				<p className="bg-gradient-to-r from-green-300 to-green-700 bg-clip-text tracking-tighter text-transparent">
					workflows and integrations
				</p>
				<p className="bg-gradient-to-r from-indigo-300 to-indigo-700 bg-clip-text tracking-tighter text-transparent">
					agile project management
				</p>
			</motion.div>
		</div>
	);
};

export default TextCycle;
