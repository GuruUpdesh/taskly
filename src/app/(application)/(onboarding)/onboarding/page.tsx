import { initAction } from "~/actions/project-actions";
import ProjectJoinForm from "~/components/page/onboarding/join-form";
import CreateProjectForm from "~/components/page/onboarding/create-project-form";

export default async function onboardingPage() {
	await initAction();

	return (
		<div className="flex justify-center">
			<div className="flex w-[600px] flex-col gap-4">
				<CreateProjectForm />
				<ProjectJoinForm />
			</div>
		</div>
	);
}
