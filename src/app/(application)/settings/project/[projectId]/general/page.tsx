import React from "react";

import { redirect } from "next/navigation";

import {
	getAllUsersInProject,
	getProject,
} from "~/actions/application/project-actions";
import { getSprintsForProject } from "~/actions/application/sprint-actions";
import { authenticate } from "~/actions/security/authenticate";
import Permission from "~/components/auth/Permission";
import ProjectDangerZone from "~/components/page/settings/project-danger-zone";
import ProjectInfo from "~/components/page/settings/project-info";
import ProjectInvite from "~/components/page/settings/project-invite";
import ProjectSprints from "~/components/page/settings/project-sprints";
import ProjectTheme from "~/components/page/settings/project-theme";
import SettingsSection from "~/components/page/settings/settings-section";
import UsersTable from "~/components/projects/users-table";
import { generalSettings } from "~/config/settings-config";
import constructToastURL from "~/lib/global-toast/global-toast-url-constructor";
import ProjectGithub from "~/components/page/settings/project-github";

type Params = {
	params: {
		projectId: string;
	};
};

async function ProjectSettingsGeneral({ params: { projectId } }: Params) {
	const userId = authenticate();

	const projectResults = await getProject(Number(projectId));
	if (!projectResults?.success || !projectResults.project) {
		if (projectResults?.message) {
			redirect(constructToastURL(projectResults.message, "error"));
		}
		redirect(constructToastURL("Issue loading project", "error"));
	}

	const project = projectResults.project;
	const sprints = await getSprintsForProject(Number(projectId));
	const users = await getAllUsersInProject(Number(projectId));

	const componentMap = {
		"project-info": <ProjectInfo project={project} />,
		appearance: <ProjectTheme project={project} />,
		invite: <ProjectInvite project={project} />,
		members: (
			<UsersTable
				users={users ?? []}
				projectId={project.id}
				userId={userId}
			/>
		),
		sprints: <ProjectSprints sprints={sprints ?? []} project={project} />,
		github: <ProjectGithub project={project} />,
		"danger-zone": <ProjectDangerZone project={project} />,
	} as const;

	return (
		<div
			className="flex flex-col gap-8 p-6"
			style={{
				scrollBehavior: "smooth",
			}}
		>
			{generalSettings.map((setting, index) => {
				return (
					<Permission
						key={index}
						allowRoles={
							setting.allowedRoles ? setting.allowedRoles : []
						}
						any={setting.allowedRoles ? false : true}
						projectId={project.id}
					>
						<SettingsSection
							anchor={setting.anchor}
							title={setting.title}
							icon={setting.icon}
						>
							{
								componentMap[
									setting.anchor as keyof typeof componentMap
								]
							}
						</SettingsSection>
					</Permission>
				);
			})}
		</div>
	);
}

export default ProjectSettingsGeneral;
