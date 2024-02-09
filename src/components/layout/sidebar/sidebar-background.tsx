/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */
"use client";

import Image from "next/image";
import ColorThief from "colorthief";
import React from "react";
import { useNavigationStore } from "~/store/navigation";

const SidebarBackground = () => {
	const project = useNavigationStore((state) => state.currentProject);
	const image = project?.image ?? "";

	const imageRef = React.useRef<HTMLImageElement>(null);

	const [color, setColor] = React.useState<string | null>(null);

	if (!image) return null;

	return (
		<>
			<div className="pointer-events-none absolute opacity-0" key={image}>
				<Image
					src={image}
					height={20}
					width={20}
					ref={imageRef}
					alt="Project Image"
					onLoad={() => {
						const colorThief = new ColorThief();
						const img = imageRef.current;
						if (img) {
							const color = colorThief.getColor(img);
							// convert [r, g, b] to #rrggbb
							const colorString = `#${color.map((c: { toString: (c: number) => string }) => c.toString(16).padStart(2, "0")).join("")}`;
							console.log("color", color, colorString);
							setColor(colorString);
						}
					}}
				/>
			</div>
			<div className="pointer-events-none animate-fade-in">
				<div
					className="absolute top-[55px] -z-10 h-full w-full"
					style={{
						opacity: 0.25,
						backgroundSize: "100% 200%",
						background: `linear-gradient(transparent 35%, ${color ?? "transparent"})`,
					}}
				/>
				<div
					className="absolute top-[55px] -z-10 h-full w-full"
					style={{
						opacity: 0.15,
						backgroundSize: "100% 200%",
						background: `linear-gradient(${color ?? "transparent"}, transparent 25%)`,
					}}
				/>
			</div>
		</>
	);
};

export default SidebarBackground;
