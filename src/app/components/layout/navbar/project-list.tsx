"use server";

import React from "react";

import { auth } from "@clerk/nextjs/server";

import { getAllProjects } from "~/actions/application/project-actions";

import { CreateProjectMenuItem, ProjectsMenuItem } from "./navbar-menu";

async function ProjectList() {
	const { userId }: { userId: string | null } = auth();
	if (!userId) return null;
	const projects = await getAllProjects(userId);
	if (!projects) {
		console.error("Error loading projects");
		return;
	}

	if (projects.length === 0) return <CreateProjectMenuItem />;

	return <ProjectsMenuItem projects={projects} />;
}

export default ProjectList;
