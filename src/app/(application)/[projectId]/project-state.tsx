"use client";

import React from "react";
import type { Project } from "~/server/db/schema";
import { useProjectStore } from "~/store/project";

type Props = {
	children: React.ReactNode;
	project: Project;
};

const ProjectState = ({ children, project }: Props) => {
	const updateProject = useProjectStore((state) => state.updateProject);

	React.useEffect(() => {
		updateProject(project);
	}, [project]);
	return children;
};

export default ProjectState;
