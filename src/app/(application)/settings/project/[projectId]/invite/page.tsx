import InviteLinkWrapper from "~/components/invite/invite-link-wrapper";

type Params = {
	params: {
		projectId: string;
	};
};

export default function ProjectSettingsInvite({
	params: { projectId },
}: Params) {
	return <InviteLinkWrapper projectId={projectId} />;
}
