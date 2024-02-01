import ProjectCreateForm from "~/components/onboarding/create-form";
import { initAction } from "~/actions/project-actions";
import ProjectJoinForm from "~/components/onboarding/join-form";
import CreateProjectForm from "~/components/onboarding/create-project-form";

export default async function onboardingPage() {
	await initAction();

	return (
		<div className="flex justify-center">
			<div className="flex flex-col gap-4 w-[600px]">
				<CreateProjectForm />
				<ProjectJoinForm />
			</div>
		</div>
	);
}
