/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */
"use client";

/**
 * This file is a bit janky because it uses a library that doesn't play well with
 * next.js and doesn't have typescript support. But it works!
 */

import Image from "next/image";
import ColorThief from "colorthief";
import React, { useEffect } from "react";
import { useNavigationStore } from "~/store/navigation";
import SidebarBackground from "./sidebar-background";
import { storeProjectColor } from "~/actions/project-actions";

const rgbToHex = (r: number, g: number, b: number) =>
	"#" +
	[r, g, b]
		.map((x) => {
			const hex = x.toString(16);
			return hex.length === 1 ? "0" + hex : hex;
		})
		.join("");

const SidebarDynamicBackground = () => {
	const project = useNavigationStore((state) => state.currentProject);
	const image = project?.image ?? "";

	const imageRef = React.useRef<HTMLImageElement>(null);

	const [color, setColor] = React.useState<string | null>(null);
	useEffect(() => {
		if (color && project) {
			void storeProjectColor(project.id, color);
		}
	}, [color, project]);

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
							const colorString = rgbToHex(
								color[0] as number,
								color[1] as number,
								color[2] as number,
							);
							setColor(colorString);
						}
					}}
				/>
			</div>
			<SidebarBackground color={color} />
		</>
	);
};

export default SidebarDynamicBackground;
