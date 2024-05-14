import React from "react";

import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

import { getAiLimitCount } from "~/actions/ai/ai-limit-actions";
import {
	getAllUsersInProject,
	getProject,
} from "~/actions/application/project-actions";
import { getSprintsForProject } from "~/actions/application/sprint-actions";
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
	const user = await currentUser();
	const aiLimitCount = await getAiLimitCount();
	if (!user) {
		redirect(
			constructToastURL(
				"You need to be logged in to view settings",
				"error",
			),
		);
	}

	const projectIdInt = parseInt(projectId, 10);
	const result = await getProject(projectIdInt, user.id);
	if (result.error !== null) {
		redirect(constructToastURL(result.error, "error"));
	}
	const project = result.data;

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
				userId={user.id}
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
