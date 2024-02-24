"use server";

import { auth } from "@clerk/nextjs";
import React from "react";
import { getAllProjects } from "~/actions/application/project-actions";

import ProjectMenuItem from "~/components/layout/navbar/project-menu-item";

import { throwServerError } from "~/utils/errors";
import CreateProjectMenuItem from "./create-project-menu-item";

async function ProjectList() {
	const { userId }: { userId: string | null } = auth();
	if (!userId) return null;
	const projects = await getAllProjects(userId);
	if (!projects) {
		throwServerError("Error Loading Projects");
		return;
	}

	if (projects.length === 0) return <CreateProjectMenuItem />;

	return <ProjectMenuItem projects={projects} />;
}

export default ProjectList;
