import { eq } from "drizzle-orm";
import DeleteProjectButton from "~/components/delete/delete-project-button";
import { db } from "~/server/db";
import { projects } from "~/server/db/schema";
import Permission from "~/components/auth/Permission";
import { getAllUsersInProject } from "~/actions/project-actions";
import { throwClientError } from "~/utils/errors";
import UsersTable from "~/components/projects/users-table";
import { Header, Header2 } from "~/components/typography/Headers";
import { Paragraph } from "~/components/typography/Paragraphs";
import { Input } from "~/components/ui/input";

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

	const users = await getAllUsersInProject(Number(projectId));

	if (!users) {
		throwClientError("Failed to get users in project");
		return null;
	}

	return (
		<>
			<div style={{ marginLeft: "3em", marginTop: "2em" }}>
				<Header>Project Settings</Header>
				<Paragraph>
					Here you manage the general settings for the project. This
					includes user permissions, project details, and more.
				</Paragraph>
				<Permission
					projectId={currentProject?.id ?? -1}
					allowRoles={["owner"]}
				>
					<Header2>Project Information</Header2>
					<div className="my-3 w-60">
						<label className="mb-2" htmlFor="projectName">
							Project Name:
						</label>
						<Input
							type="text"
							id="projectName"
							style={{ marginTop: "0.5em" }}
							value={currentProject?.name}
							disabled
						/>
					</div>

					<Header2>Users</Header2>
					<div style={{ width: "95%" }}>
						<UsersTable users={users} />
					</div>
					<Header2>Danger</Header2>
					<DeleteProjectButton
						projectName={
							currentProject ? currentProject.name : "error"
						}
						projectId={projectId}
					/>
				</Permission>
			</div>
		</>
	);
}
