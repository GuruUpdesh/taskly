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
