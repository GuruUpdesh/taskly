"use server";

import React from "react";

import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

import { getAiLimitCount } from "~/actions/ai/ai-limit-actions";
import {
	getAllUsersInProject,
	getProject,
} from "~/actions/application/project-actions";
import { getSprintsForProject } from "~/actions/application/sprint-actions";
import Permission from "~/components/Permission";
import { generalSettings } from "~/config/settingsConfig";
import ProjectDangerZone from "~/features/settings/components/ProjectDangerZone";
import ProjectGithub from "~/features/settings/components/ProjectGithub";
import ProjectInfo from "~/features/settings/components/ProjectInfo";
import ProjectInvite from "~/features/settings/components/ProjectInvite";
import ProjectSprints from "~/features/settings/components/ProjectSprints";
import ProjectTheme from "~/features/settings/components/ProjectTheme";
import SettingsSection from "~/features/settings/components/SettingsSection";
import UsersTable from "~/features/settings/components/users-table";
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
		General: <ProjectInfo project={project} />,
		Appearance: (
			<ProjectTheme project={project} aiLimitCount={aiLimitCount} />
		),
		Invite: <ProjectInvite project={project} />,
		Sprints: <ProjectSprints sprints={sprints ?? []} project={project} />,
		GitHub: <ProjectGithub project={project} />,
		"Danger Zone": <ProjectDangerZone project={project} />,
	} as const;

	return (
		<>
			{generalSettings.map((setting, index) => {
				if (setting.title === "Members") {
					return (
						<UsersTable
							key={index}
							users={users ?? []}
							projectId={project.id}
							userId={user.id}
						/>
					);
				}
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
							title={setting.title}
							icon={setting.icon}
						>
							{
								componentMap[
									setting.title as keyof typeof componentMap
								]
							}
						</SettingsSection>
					</Permission>
				);
			})}
		</>
	);
}

export default ProjectSettingsGeneral;
