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
				indigo: "border-indigo-400/15 bg-indigo-800/10 hover:bg-indigo-400/15",
				red: "border-red-400/15 bg-red-800/10 hover:bg-red-400/15",
				green: "border-green-400/15 bg-green-800/10 hover:bg-green-400/15",
				blue: "border-sky-400/15 bg-sky-800/10 hover:bg-sky-400/15",
				yellow: "border-yellow-400/15 bg-yellow-800/10 hover:bg-yellow-400/15",
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
}

const Panel = ({ title, icon, description, color, className }: Props) => {
	return (
		<div className={cn(panelVariants({ color: color }), className)}>
			<div className="flex h-full w-full flex-col gap-4 rounded-md px-4 py-[12px]">
				<h3
					className={cn(
						typography.headers.h2,
						"border-none pb-0 text-2xl font-semibold lg:text-3xl",
					)}
				>
					{title}
				</h3>
				<p
					className={cn(
						typography.paragraph.p_muted,
						"!m-0 text-foreground",
					)}
				>
					{description}
				</p>
				<div className="flex-1" />
				<div className="flex w-full justify-between">
					<div className={iconVariants({ color: color })}>{icon}</div>
					<Button variant="ghost">
						Learn More
						<ChevronRight className="h-4 w-4" />
					</Button>
				</div>
			</div>
		</div>
	);
};

export default Panel;
