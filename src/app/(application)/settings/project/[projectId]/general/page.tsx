import React from "react";

import { redirect } from "next/navigation";

import { getAiLimitCount } from "~/actions/ai/ai-limit-actions";
import {
	getAllUsersInProject,
	getProject,
} from "~/actions/application/project-actions";
import { getSprintsForProject } from "~/actions/application/sprint-actions";
import { authenticate } from "~/actions/security/authenticate";
import ProjectDangerZone from "~/app/(application)/settings/components/ProjectDangerZone";
import ProjectGithub from "~/app/(application)/settings/components/ProjectGithub";
import ProjectInfo from "~/app/(application)/settings/components/ProjectInfo";
import ProjectInvite from "~/app/(application)/settings/components/ProjectInvite";
import ProjectSprints from "~/app/(application)/settings/components/ProjectSprints";
import ProjectTheme from "~/app/(application)/settings/components/ProjectTheme";
import SettingsSection from "~/app/(application)/settings/components/SettingsSection";
import UsersTable from "~/app/(application)/settings/components/users-table";
import Permission from "~/app/components/Permission";
import { generalSettings } from "~/config/settingsConfig";
import constructToastURL from "~/lib/toast/global-toast-url-constructor";

type Params = {
	params: {
		projectId: string;
	};
};

async function ProjectSettingsGeneral({ params: { projectId } }: Params) {
	const userId = authenticate();
	const aiLimitCount = await getAiLimitCount();

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
		appearance: (
			<ProjectTheme project={project} aiLimitCount={aiLimitCount} />
		),
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
