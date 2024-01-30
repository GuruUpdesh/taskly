import { auth } from "@clerk/nextjs";
import { joinProject } from "~/actions/invite-actions";
import Joining from "./joining";

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
	const result = await joinProject(decodedToken, userId);

	if (result.success && result.projectId) {
		return <Joining redirectURL={`/project/${result.projectId}/backlog`} />;
	}
	return (
		<div className="container flex flex-col pt-4">
			<p>{result.message}</p>
		</div>
	);
}
