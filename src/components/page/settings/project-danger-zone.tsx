import React from "react";
import Permission from "~/components/auth/Permission";
import DeleteProjectButton from "~/components/projects/delete-project-button";
import LeaveProjectButton from "~/components/projects/leave-project-button";
import { type Project } from "~/server/db/schema";

type Props = {
	project: Project;
};

const ProjectDangerZone = ({ project }: Props) => {
	return (
		<div className="flex items-center gap-3">
			<Permission projectId={project.id} allowRoles={["member", "admin"]}>
				<LeaveProjectButton
					projectName={project.name}
					projectId={project.id}
				/>
			</Permission>
			<Permission projectId={project.id} allowRoles={["owner"]}>
				<DeleteProjectButton
					projectName={project.name}
					projectId={project.id}
				/>
			</Permission>
		</div>
	);
};

export default ProjectDangerZone;
