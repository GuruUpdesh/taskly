"use client";

import React from "react";

import { type VariantProps, cva } from "class-variance-authority";

import { cn } from "~/lib/utils";
import typography from "~/styles/typography";

const panelVariants = cva(
	"rounded-lg p-[2px] group z-10 border overflow-hidden backdrop-blur-xl transition-colors ease-in-out duration-500",
	{
		variants: {
			color: {
				indigo: "border-indigo-400/25 bg-indigo-800/5 hover:bg-indigo-800/20",
				red: "border-red-400/25 bg-red-800/5 hover:bg-red-400/10",
				green: "border-green-400/25 bg-green-800/5 hover:bg-green-400/10",
				blue: "border-blue-400/25 bg-blue-800/5 hover:bg-blue-400/10",
				yellow: "border-yellow-400/25 bg-yellow-800/5 hover:bg-yellow-400/10",
			},
		},
		defaultVariants: {
			color: "indigo",
		},
	},
);

interface Props extends VariantProps<typeof panelVariants> {
	title: string;
	icon: React.ReactNode;
	description: string;
	className?: string;
	children?: React.ReactNode;
}

const Panel = ({
	title,
	icon,
	description,
	color,
	className,
	children,
}: Props) => {
	return (
		<div className={cn(panelVariants({ color: color }), className)}>
			<div className="flex h-full w-full flex-col rounded-md px-4 py-[12px]">
				<h3
					className={cn(
						typography.headers.h2,
						"mb-6 flex items-center gap-2 border-none pb-0 text-lg font-semibold lg:text-xl",
					)}
				>
					{icon}
					{title}
				</h3>
				{children}
				<div className="flex-1" />
				<p
					className={cn(
						typography.paragraph.p_muted,
						"mt-6 text-sm text-foreground opacity-80",
					)}
				>
					{description}
				</p>
			</div>
		</div>
	);
};

export default Panel;
