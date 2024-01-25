import { auth } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
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
	//const router = useRouter();
	const decodedToken = decodeURIComponent(token);
	const { userId }: { userId: string | null } = auth();
	if (!userId) return null;
	const result = await joinProject(decodedToken, userId);

	if (result.success && result.projectId) {
		return (
			// router.push(`/${result.projectId}/backlog`)
			<Joining redirectURL={`/${result.projectId}/backlog`} />
		);
	}

	return (
		<div className="container flex flex-col pt-4">
			<p>{result.message}</p>
		</div>
	);
}
