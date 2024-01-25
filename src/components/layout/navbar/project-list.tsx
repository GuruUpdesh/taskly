"use server";

import { auth } from "@clerk/nextjs";
import React from "react";
import { getAllProjects } from "~/actions/project-actions";

import ProjectMenuItem from "~/components/layout/navbar/project-menu-item";
import { throwClientError } from "~/utils/errors";

async function ProjectList() {
	const { userId }: { userId: string | null } = auth();
	if (!userId) return null;
	const projects = await getAllProjects(userId);
	if (!projects) return throwClientError("Error Loading Projects");

	return <ProjectMenuItem projects={projects} />;
}

export default ProjectList;
