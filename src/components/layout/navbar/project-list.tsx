"use server";

import React from "react";
import { getAllProjects } from "~/actions/project-actions";

import ProjectMenuItem from "~/components/layout/navbar/project-menu-item";

async function ProjectList() {
	const projects = await getAllProjects();
	if (!projects) return <p>Error</p>;

	return <ProjectMenuItem projects={projects} />;
}

export default ProjectList;
