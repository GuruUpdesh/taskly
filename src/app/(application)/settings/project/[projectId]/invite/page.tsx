import { auth } from "@clerk/nextjs";
import dynamic from "next/dynamic";
import { createInvite } from "~/actions/invite-actions";
const InviteLink = dynamic(() => import("~/components/invite/invite-link"), {
	ssr: false,
});

type Params = {
	params: {
		projectId: string;
	};
};

export default async function ProjectSettingsInvite({
	params: { projectId },
}: Params) {
	const { userId }: { userId: string | null } = auth();
	if (!userId) return null;
	const inviteLink = await createInvite(userId, projectId);
	if (inviteLink === false) return null;

	return (
		<div className="container flex flex-col pt-4">
			<h1>Invite with Link</h1>
			<p>Invite a user using the link below!</p>
			<InviteLink inviteLink={inviteLink} />
		</div>
	);
}
