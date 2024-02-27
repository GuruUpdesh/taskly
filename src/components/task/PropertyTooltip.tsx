import React from "react";

import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "~/components/ui/tooltip";

type Props = {
	children: React.ReactNode;
	content: React.ReactNode;
};

const PropertyTooltip = ({ children, content }: Props) => {
	return (
		<TooltipProvider>
			<Tooltip>
				<TooltipTrigger asChild>{children}</TooltipTrigger>
				<TooltipContent side="bottom">{content}</TooltipContent>
			</Tooltip>
		</TooltipProvider>
	);
};

export default PropertyTooltip;
