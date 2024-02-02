import { eq } from "drizzle-orm";
import DeleteProjectButton from "~/components/delete/delete-project-button";
import { db } from "~/server/db";
import { projects } from "~/server/db/schema";
import Permission from "~/components/auth/Permission";

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
		<>
			<Permission
				projectId={currentProject?.id ?? -1}
				allowRoles={["owner"]}
			>
				<DeleteProjectButton
					projectName={currentProject ? currentProject.name : "error"}
					projectId={projectId}
				/>
			</Permission>
		</>
	);
}
