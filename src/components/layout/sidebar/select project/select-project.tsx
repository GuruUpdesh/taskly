"use server";

import React from "react";

import { auth } from "@clerk/nextjs/server";

import { getAllProjects } from "~/actions/application/project-actions";
import { throwServerError } from "~/utils/errors";

import ProjectCombobox from "./project-combobox";

type Props = {
	projectId: string;
};

async function SelectProject({ projectId }: Props) {
	const { userId }: { userId: string | null } = auth();
	if (!userId) return null;
	const projects = await getAllProjects(userId);
	if (!projects) {
		throwServerError("Error Loading Projects");
		return;
	}

	return <ProjectCombobox projects={projects} projectId={projectId} />;
}

export default SelectProject;
