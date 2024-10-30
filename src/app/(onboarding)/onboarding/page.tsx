import { initAction } from "~/actions/project-actions";

import CreateProjectForm from "../components/CreateProjectForm";

export default async function onboardingPage() {
	await initAction();

	return (
		<div className="flex justify-center">
			<div className="flex flex-col gap-4">
				<CreateProjectForm className="rounded-lg border bg-background-dialog shadow-xl backdrop-blur-lg" />
			</div>
		</div>
	);
}
