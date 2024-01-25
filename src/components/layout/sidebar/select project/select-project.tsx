"use server";

import React from "react";
import { getAllProjects } from "~/actions/project-actions";
import ProjectCombobox from "./project-combobox";
import { auth } from "@clerk/nextjs";
import { throwServerError } from "~/utils/errors";

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
