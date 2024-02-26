import React from "react";

import { cn } from "~/lib/utils";
import typography from "~/styles/typography";

type Props = {
	header: string;
	description: string;
	children: React.ReactNode;
};

const StepHeader = ({ header, description, children }: Props) => {
	return (
		<div className="mb-8">
			<h1
				className={cn(
					typography.headers.h2,
					"flex items-center gap-2 border-none",
				)}
			>
				{children}
				{header}
			</h1>
			<p className={typography.paragraph.p_muted}>{description}</p>
		</div>
	);
};

export default StepHeader;
