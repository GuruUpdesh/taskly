"use client";

import React from "react";
import type { Project } from "~/server/db/schema";
import { useProjectStore } from "~/store/project";

type Props = {
	project: Project;
};

const ProjectState = ({ project }: Props) => {
	const updateProject = useProjectStore((state) => state.updateProject);

	React.useEffect(() => {
		updateProject(project);
	}, [project]);

	return null;
};

export default ProjectState;
