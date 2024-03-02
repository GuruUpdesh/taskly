import React from "react";

import type { TooltipProps } from "recharts";
import type {
	NameType,
	ValueType,
} from "recharts/types/component/DefaultTooltipContent";

type Props = TooltipProps<ValueType, NameType>;

const GraphTooltip = ({ payload, label }: Props) => {
	return (
		<div className="rounded-sm border bg-accent/50 p-2 backdrop-blur-lg">
			<h1 className="border-b">{label}</h1>
			{payload?.map((item, index) => (
				<p key={index}>
					{item.name}: {item.value}
				</p>
			))}
		</div>
	);
};

export default GraphTooltip;
