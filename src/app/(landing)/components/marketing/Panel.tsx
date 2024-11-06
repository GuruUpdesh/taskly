import React from "react";

import { type VariantProps, cva } from "class-variance-authority";
import { ChevronRight } from "lucide-react";

import { Button } from "~/components/ui/button";
import { cn } from "~/lib/utils";
import typography from "~/styles/typography";

const panelVariants = cva(
	"rounded-lg p-[2px] group z-10 border overflow-hidden backdrop-blur-xl transition-colors",
	{
		variants: {
			color: {
				indigo: "border-indigo-400/15 bg-indigo-800/10 ",
				red: "border-red-400/15 bg-red-800/10",
				green: "border-green-400/15 bg-green-800/10",
				blue: "border-sky-400/15 bg-sky-800/10",
				yellow: "border-yellow-400/15 bg-yellow-800/10",
			},
		},
		defaultVariants: {
			color: "indigo",
		},
	},
);

const iconVariants = cva(
	"flex aspect-square w-min items-center gap-2 rounded-lg p-2",
	{
		variants: {
			color: {
				indigo: "bg-indigo-900 text-indigo-400",
				red: "bg-red-900 text-red-400",
				green: "bg-green-900 text-green-400",
				blue: "bg-blue-900 text-blue-400",
				yellow: "bg-yellow-900 text-yellow-400",
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
			<div className="flex h-full w-full flex-col gap-3 rounded-md px-4 py-[12px]">
				<div className="flex items-center gap-3">
					<div className={iconVariants({ color: color })}>{icon}</div>
					<h3
						className={cn(
							typography.headers.h2,
							"mb-0 border-none pb-0 text-2xl font-medium",
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
				{children}
			</div>
		</div>
	);
};

export default Panel;
