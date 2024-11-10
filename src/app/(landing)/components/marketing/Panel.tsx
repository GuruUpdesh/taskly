import React from "react";

import { type VariantProps, cva } from "class-variance-authority";

import { cn } from "~/lib/utils";
import typography from "~/styles/typography";

const panelVariants = cva(
	"rounded-lg group z-10 overflow-hidden transition-colors",
	{
		variants: {
			color: {
				indigo: "bg-foreground/5 ",
				red: "bg-foreground/5 ",
				green: "bg-foreground/5 ",
				blue: "bg-foreground/5 ",
				yellow: "bg-foreground/5 ",
			},
		},
		defaultVariants: {
			color: "indigo",
		},
	},
);

const iconVariants = cva(
	"flex aspect-square w-min items-center gap-2 rounded-md p-2",
	{
		variants: {
			color: {
				indigo: "bg-indigo-800/35 text-indigo-400",
				red: "bg-red-800/35 text-red-300",
				green: "bg-green-900 text-green-400",
				blue: "bg-blue-900 text-blue-400",
				yellow: "bg-yellow-800/35 text-amber-300/75",
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
	children?: React.ReactElement;
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
			<div className="flex h-full w-full flex-col gap-3 rounded-md">
				<div className="px-4 py-[12px]">
					<div className="mb-2 flex items-center gap-3">
						<div className={iconVariants({ color: color })}>
							{icon}
						</div>
						<h3
							className={cn(
								typography.headers.h2,
								"border-none pb-0 text-2xl font-medium",
							)}
						>
							{title}
						</h3>
					</div>
					<p
						className={cn(
							typography.paragraph.p_muted,
							"!m-0 text-sm text-foreground",
						)}
					>
						{description}
					</p>
				</div>
				{children}
			</div>
		</div>
	);
};

export default Panel;
