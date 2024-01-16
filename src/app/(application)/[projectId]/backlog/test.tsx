"use client";

import React from "react";
import { useProjectStore } from "~/store/project";

const Test = () => {
	// We can remove this component (its here as an example of how to use the store)
	const project = useProjectStore((state) => state.project);

	if (!project) return null;
	return (
		<ul>
			{Object.entries(project).map(([key, value]) => (
				<li key={key}>
					{key}: {JSON.stringify(value)}
				</li>
			))}
		</ul>
	);
};

export default Test;
