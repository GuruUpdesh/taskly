"use client";

import React from "react";
import type { Project } from "~/server/db/schema";
import { useNavigationStore } from "~/store/navigation";

type Props = {
	project: Project;
};

const ProjectState = ({ project }: Props) => {
	const updateProject = useNavigationStore((state) => state.updateProject);

	React.useEffect(() => {
		updateProject(project);
	}, [project]);

	return null;
};

export default ProjectState;
