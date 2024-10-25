import React from "react";

import EmailInviteWrapper from "~/app/components/invite/by-email/email-invite-wrapper";
import InviteLinkWrapper from "~/app/components/invite/invite-link-wrapper";
import { type Project } from "~/server/db/schema";

type Props = {
	project: Project;
};

const ProjectInvite = ({ project }: Props) => {
	return (
		<div className="flex flex-col gap-4">
			<EmailInviteWrapper projectId={project.id} />
			<InviteLinkWrapper projectId={project.id} />
		</div>
	);
};

export default ProjectInvite;
