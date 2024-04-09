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
				indigo: "border-indigo-400/25 bg-indigo-800/5 hover:bg-indigo-400/15",
				red: "border-red-400/25 bg-red-800/5 hover:bg-red-400/15",
				green: "border-green-400/25 bg-green-800/5 hover:bg-green-400/15",
				blue: "border-blue-400/25 bg-blue-800/5 hover:bg-blue-400/15",
				yellow: "border-yellow-400/25 bg-yellow-800/5 hover:bg-yellow-400/15",
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
			<div className="flex h-full w-full flex-col rounded-md px-4 py-[12px]">
				<h3
					className={cn(
						typography.headers.h2,
						"mb-2 border-none pb-0 text-2xl font-semibold lg:text-3xl",
					)}
				>
					{title}
				</h3>
				<p
					className={cn(
						typography.paragraph.p_muted,
						"mb-8 text-foreground opacity-80",
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
