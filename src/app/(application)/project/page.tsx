import ProjectCreateForm from "~/components/onboarding/create-form";
import { initAction } from "~/actions/project-actions";
import ProjectJoinForm from "~/components/onboarding/join-form";

export default async function SettingsOverviewPage() {
	await initAction();

	return (
		<div className="flex justify-center pt-24 z-10">
			<div className="bg-background">
				<ProjectCreateForm />
				<ProjectJoinForm />
			</div>
		</div>
	);
}
