import { auth } from "@clerk/nextjs";
import { joinProject } from "~/actions/invite-actions";

type Params = {
	params: {
		token: string;
	};
};

export default async function ProjectSettingsInvite({
	params: { token },
}: Params) {
	const decodedToken = decodeURIComponent(token);
	const { userId }: { userId: string | null } = auth();
	if (!userId) return null;
	const success = await joinProject(decodedToken, userId);

	return (
		<div className="container flex flex-col pt-4">
			<p>{success}</p>
		</div>
	);
}
