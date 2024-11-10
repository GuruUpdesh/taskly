import { type Metadata } from "next";

import ProjectCreateForm from "../components/CreateProjectForm";

export const metadata: Metadata = {
	title: "Create Project",
};

export default function createProjectPage() {
	return (
		<div className="flex justify-center">
			<div className="flex flex-col gap-4">
				<ProjectCreateForm className="rounded-lg border bg-background-dialog shadow-xl backdrop-blur-lg" />
			</div>
		</div>
	);
}
