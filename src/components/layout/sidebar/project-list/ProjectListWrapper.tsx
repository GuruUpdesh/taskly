"use server";

import React from "react";

import { auth } from "@clerk/nextjs/server";

import { getAllProjects } from "~/actions/project-actions";
import { throwServerError } from "~/utils/errors";

import ProjectList from "./ProjectList";

async function ProjectListWrapper() {
	const { userId }: { userId: string | null } = await auth();
	if (!userId) return null;
	const projects = await getAllProjects(userId);
	if (!projects) {
		throwServerError("Error Loading Projects");
		return;
	}

	return <ProjectList projects={projects} />;
}

export default ProjectListWrapper;
