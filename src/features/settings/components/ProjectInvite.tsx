import React from "react";

import EmailInviteWrapper from "~/features/invite/components/by-email/email-invite-wrapper";
import InviteLinkWrapper from "~/features/invite/components/invite-link-wrapper";
import { type Project } from "~/schema";

type Props = {
	project: Project;
};

const ProjectInvite = ({ project }: Props) => {
	return (
		<div className="flex flex-col gap-4">
			{/* <EmailInviteWrapper projectId={project.id} /> */}
			<InviteLinkWrapper projectId={project.id} />
		</div>
	);
};

export default ProjectInvite;
