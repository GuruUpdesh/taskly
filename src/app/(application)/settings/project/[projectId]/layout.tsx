import React from "react";

import { getProject } from "~/actions/application/project-actions";

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
	const result = await getProject(Number(projectId));
	if (!result?.success || !result.project) {
		return <div>{result?.message}</div>;
	}

	return <>{children}</>;
}
