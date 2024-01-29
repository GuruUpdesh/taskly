import ProjectCreateForm from "~/components/projects/create-form";
import { initAction } from "~/actions/project-actions";
import ProjectJoinForm from "~/components/projects/join-form";

export default async function SettingsOverviewPage() {
	await initAction();

	return (
		<div className="flex justify-center pt-24">
			<div>
				<ProjectCreateForm />
				<ProjectJoinForm />
			</div>
		</div>
	);
}
