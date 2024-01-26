import ProjectCreateForm from "~/components/projects/create-form";
import { initAction } from "~/actions/project-actions";

export default async function SettingsOverviewPage() {
	await initAction();

	return (
		<div className="flex justify-center pt-24">
			<ProjectCreateForm />
		</div>
	);
}
