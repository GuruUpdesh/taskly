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
	label: string;
	side?: TooltipContentProps["side"];
	open?: boolean;
};

const SimpleTooltip = ({
	children,
	label,
	side = "bottom",
	open = false,
}: Props) => {
	return (
		<TooltipProvider delayDuration={250} disableHoverableContent>
			<Tooltip open={open}>
				<TooltipTrigger asChild>{children}</TooltipTrigger>
				<TooltipContent side={side}>{label}</TooltipContent>
			</Tooltip>
		</TooltipProvider>
	);
};

export default SimpleTooltip;
