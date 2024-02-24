import { initAction } from "~/actions/application/project-actions";
import CreateProjectForm from "~/components/page/onboarding/create-project-form";

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
