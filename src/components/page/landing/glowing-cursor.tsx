"use client";

import React from "react";

type Props = {
	children: React.ReactNode;
	className: string;
};

const GlowingCursor = ({ children, className }: Props) => {
	const cursorRef = React.useRef<HTMLDivElement>(null);
	const handleMouseMove = (e: React.MouseEvent) => {
		if (!cursorRef.current) return;
		const { currentTarget: target } = e;
		const rect = target.getBoundingClientRect();
		const x = e.clientX - rect.left;
		const y = e.clientY - rect.top;

		cursorRef.current.style.left = `${x}px`;
		cursorRef.current.style.top = `${y}px`;
	};
	return (
		<div className={className} onMouseMove={handleMouseMove}>
			<div
				className="pointer-events-none absolute left-1/2 top-1/2 h-16 w-16 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white opacity-0 blur-3xl transition-opacity group-hover:opacity-100"
				ref={cursorRef}
			/>
			{children}
		</div>
	);
};

export default GlowingCursor;
