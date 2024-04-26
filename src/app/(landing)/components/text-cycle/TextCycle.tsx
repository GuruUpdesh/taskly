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

type Props = {
	defaultTextHeight?: number;
};

const TextCycle = ({ defaultTextHeight = 0 }: Props) => {
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
			document.cookie = `landing-text:textHeight=${textHeight}`;

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
		<div
			className="cycle-text-container text-3xl sm:text-6xl lg:text-7xl"
			style={{
				height: `${defaultTextHeight}px`,
			}}
			ref={containerRef}
		>
			<motion.div
				className="cycle-text"
				style={
					{
						"--padding-y": "16px",
						transform: "translateY(-16px)",
					} as React.CSSProperties
				}
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
