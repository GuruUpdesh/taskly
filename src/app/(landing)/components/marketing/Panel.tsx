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

const iconVariants = cva("absolute bottom-0 -right-1 -z-10 opacity-15", {
	variants: {
		color: {
			indigo: "text-indigo-400",
			red: "text-red-400",
			green: "text-green-400",
			blue: "text-blue-400",
			yellow: "text-yellow-400",
		},
	},
	defaultVariants: {
		color: "indigo",
	},
});

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
				<div className={iconVariants({ color: color })}>{icon}</div>
			</div>
		</div>
	);
};

export default Panel;
