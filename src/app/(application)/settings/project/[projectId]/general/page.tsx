import { eq } from "drizzle-orm";
import DeleteProjectButton from "~/components/delete/delete-project-button";
import { db } from "~/server/db";
import { projects } from "~/server/db/schema";
import Permission from "~/components/auth/Permission";
import { getAllUsersInProject } from "~/actions/project-actions";
import { throwClientError } from "~/utils/errors";
import UsersTable from "~/components/projects/users-table";
import typography from "~/utils/typography";
import { Input } from "~/components/ui/input";
import { cn } from "~/lib/utils";
import { Label } from "~/components/ui/label";
import SprintOptions from "~/components/projects/sprint-options";
import { Textarea } from "~/components/ui/textarea";

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
	if (!currentProject) {
		return null;
	}

	const users = await getAllUsersInProject(Number(projectId));

	if (!users) {
		throwClientError("Failed to get users in project");
		return null;
	}

	return (
		<div className="flex flex-col gap-8 p-6">
			<header>
				<h2 className={cn(typography.headers.h2, "pb-0")}>
					General Project Settings
				</h2>
				<p className={cn(typography.paragraph.p, "!mt-2")}>
					Here you manage the general settings for the project. This
					includes user permissions, project details, and more.
				</p>
			</header>
			<Permission
				projectId={currentProject?.id ?? -1}
				allowRoles={["owner"]}
			>
				<div className="rounded-lg border p-4">
					<h3 className={cn(typography.headers.h3, "")}>
						Project Information
					</h3>
					<p
						className={cn(
							typography.paragraph.p,
							"!mt-2 mb-4 text-muted-foreground",
						)}
					>
						General information about the project, make sure to save
						any changes.
					</p>
					<div className="grid w-full max-w-sm items-center gap-1.5">
						<Label htmlFor="projectName" className="font-bold">
							Project Name
						</Label>
						<Input
							type="text"
							id="projectName"
							className="mb-4"
							value={currentProject?.name}
							disabled
						/>
						<Label
							htmlFor="projectDescription"
							className="font-bold"
						>
							Project Description
						</Label>
						<Textarea
							id="projectDescription"
							placeholder="description"
							disabled
						/>
					</div>
				</div>
				<div className="rounded-lg border p-4">
					<h3 className={cn(typography.headers.h3)}>Users</h3>
					<div style={{ width: "95%" }}>
						<UsersTable users={users} />
					</div>
				</div>
				<div className="rounded-lg border p-4">
					<h3 className={cn(typography.headers.h3, "mb-4")}>
						Sprints
					</h3>
					<SprintOptions project={currentProject} />
				</div>
				<div className="rounded-lg border border-red-500 p-4">
					<h3 className={cn(typography.headers.h3)}>Danger Zone</h3>
					<DeleteProjectButton
						projectName={
							currentProject ? currentProject.name : "error"
						}
						projectId={projectId}
					/>
				</div>
			</Permission>
		</div>
	);
}
