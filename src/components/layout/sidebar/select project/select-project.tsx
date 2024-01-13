"use server";

import React from "react";
import { getAllProjects } from "~/actions/project-actions";
import ProjectCombobox from "./project-combobox";

type Props = {
	projectId: string;
};

async function SelectProject({ projectId }: Props) {
	const projects = await getAllProjects();
	if (!projects) return <p>Error</p>;

	return <ProjectCombobox projects={projects} projectId={projectId} />;
}

export default SelectProject;
