import { eq } from "drizzle-orm";
import DeleteProjectButton from "~/components/delete/delete-project-button";
import { db } from "~/server/db";
import { projects } from "~/server/db/schema";

type Params = {
	params: {
		projectId: string;
	};
};

export default async function projectSettingsGeneral({
	params: { projectId },
}: Params) {
	const getProjects = await db
		.select()
		.from(projects)
		.where(eq(projects.id, Number(projectId)));

	const currentProject = getProjects[0];

	return (
		<DeleteProjectButton
			projectName={currentProject ? currentProject.name : "error"}
			projectId={projectId}
		/>
	);
}
