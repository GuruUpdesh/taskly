import EmailInviteWrapper from "~/components/invite/by-email/email-invite-wrapper";
import InviteLinkWrapper from "~/components/invite/invite-link-wrapper";

type Params = {
	params: {
		projectId: string;
	};
};

export default function ProjectSettingsInvite({
	params: { projectId },
}: Params) {
	return (
		<>
			<EmailInviteWrapper projectId={projectId} />
			<InviteLinkWrapper projectId={projectId} />
		</>
	);
}
