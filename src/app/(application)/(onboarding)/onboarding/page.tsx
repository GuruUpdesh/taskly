import { initAction } from "~/actions/project-actions";
import CreateProjectForm from "~/components/onboarding/create-project-form";

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
