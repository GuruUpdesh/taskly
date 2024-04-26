import { auth } from "@clerk/nextjs/server";
import { type Metadata } from "next";
import { redirect } from "next/navigation";

import {
	getAllProjects,
	initAction,
} from "~/actions/application/project-actions";

import ProjectCreateForm from "../components/CreateProjectForm";

export const metadata: Metadata = {
	title: "Create Project",
};

export default async function createProjectPage() {
	await initAction();
	const user = auth();

	if (!user || !user.userId) {
		return null;
	}

	const projects = await getAllProjects(user.userId);

	if (!projects || projects.length === 0) {
		redirect("/onboarding");
	}

	return (
		<div className="flex justify-center">
			<div className="flex flex-col gap-4">
				<ProjectCreateForm />
			</div>
		</div>
	);
}
