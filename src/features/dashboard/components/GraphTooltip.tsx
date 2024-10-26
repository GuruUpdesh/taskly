import React from "react";

import type { TooltipProps } from "recharts";
import type {
	NameType,
	ValueType,
} from "recharts/types/component/DefaultTooltipContent";

type Props = TooltipProps<ValueType, NameType>;

const GraphTooltip = ({ label }: Props) => {
	return (
		<div className="rounded-sm border bg-accent/50 p-2 backdrop-blur-lg">
			<p className="text-xs">{label}</p>
		</div>
	);
};

export default GraphTooltip;
