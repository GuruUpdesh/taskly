import React from "react";

import { type TooltipContentProps } from "@radix-ui/react-tooltip";

import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "~/components/ui/tooltip";

type Props = {
	children: React.ReactNode;
	label: React.ReactNode;
	side?: TooltipContentProps["side"];
	shortcut?: string[];
};

const SimpleTooltip = ({ children, label, side = "bottom" }: Props) => {
	return (
		<TooltipProvider delayDuration={250} disableHoverableContent>
			<Tooltip>
				<TooltipTrigger asChild>{children}</TooltipTrigger>
				<TooltipContent side={side}>{label}</TooltipContent>
			</Tooltip>
		</TooltipProvider>
	);
};

export default SimpleTooltip;
