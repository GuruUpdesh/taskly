"use client";

import React, { useRef, useState } from "react";
import { cn } from "~/lib/utils";

type Props = {
	children: React.ReactNode;
};

const LeftDrawer = ({ children }: Props) => {
	const drawerRef = useRef<HTMLDivElement | null>(null);
	const [isResizing, setIsResizing] = useState(false);

	// handle resize actions
	// disable selection when resizing
	function disableSelect(e) {
		e.preventDefault();
	}

	const handleResizeMouseDown = (e: React.MouseEvent) => {
		setIsResizing(true);
		document.addEventListener("mousemove", handleResizeMouseMove);
		document.addEventListener("mouseup", handleResizeMouseUp);
		document.addEventListener("selectstart", disableSelect);
	};

	const handleResizeMouseUp = () => {
		setIsResizing(false);
		document.removeEventListener("mousemove", handleResizeMouseMove);
		document.removeEventListener("mouseup", handleResizeMouseUp);
		document.removeEventListener("selectstart", disableSelect);

		if (drawerRef.current) {
			localStorage.setItem(
				"sidebarWidth",
				drawerRef.current.style.getPropertyValue("--sidebarWidth"),
			);
		}
	};

	const handleResizeMouseMove = (e: React.MouseEvent) => {
		if (!drawerRef.current) return;
		// we need to get the offset of the sidebar from the left of the page
		const offsetRight = e.clientX - document.body.offsetLeft;

		const max = document.body.offsetWidth * 0.5;
		const min = 100;

		let newWidth = offsetRight;
		if (newWidth > max) newWidth = max;
		if (newWidth < min) newWidth = min;
		drawerRef.current.style.setProperty("--sidebarWidth", newWidth + "px");
	};
	return (
		<div ref={drawerRef}>
			<>
				<div className="h-1 w-[--sidebarWidth] min-w-[100px]" />
				<div className="absolute top-[65px] h-screen min-w-[100px] w-[--sidebarWidth] overflow-hidden border-r bg-background">
					<div
						onMouseDown={handleResizeMouseDown}
						className={cn(
							"absolute right-0 h-full w-1 cursor-ew-resize opacity-0 hover:opacity-100",
							isResizing
								? "bg-blue-500 opacity-100"
								: "bg-muted ",
						)}
					/>
					<section className="px-6 py-3">{children}</section>
				</div>
			</>
		</div>
	);
};

export default LeftDrawer;
