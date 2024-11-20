import React from "react";

import InviteLinkWrapper from "~/features/invite/components/invite-link-wrapper";
import { type Project } from "~/schema";

type Props = {
	project: Project;
};

const ProjectInvite = ({ project }: Props) => {
	return (
		<div className="flex flex-col gap-4">
			<InviteLinkWrapper projectId={project.id} />
		</div>
	);
};

export default ProjectInvite;
