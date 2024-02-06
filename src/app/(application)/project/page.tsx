import ProjectCreateForm from "~/components/page/onboarding/create-project-form";
import { initAction } from "~/actions/project-actions";
import ProjectJoinForm from "~/components/page/onboarding/join-form";

export default async function SettingsOverviewPage() {
	await initAction();

	return (
		<div className="z-10 flex justify-center pt-24">
			<div className="bg-background">
				<ProjectCreateForm />
				<ProjectJoinForm />
			</div>
		</div>
	);
}
