import React from "react";
import { getProject } from "~/actions/project-actions";

type Params = {
	children: React.ReactNode;
	params: {
		projectId: string;
	};
};

export default async function ProjectSettingsLayout({
	children,
	params: { projectId },
}: Params) {
	const project = await getProject(Number(projectId));

	if (!project) {
		return <div>Project not found</div>;
	}

	return (
		<>
			<h1>Project Settings</h1>
			{children}
		</>
	);
}
