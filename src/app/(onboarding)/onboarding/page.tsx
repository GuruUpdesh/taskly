import { initAction } from "~/actions/application/project-actions";

import CreateProjectForm from "../components/CreateProjectForm";

export default async function onboardingPage() {
	await initAction();

	return (
		<div className="flex justify-center">
			<div className="flex flex-col gap-4">
				<CreateProjectForm />
			</div>
		</div>
	);
}
