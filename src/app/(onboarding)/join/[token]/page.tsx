import { auth } from "@clerk/nextjs";
import { joinProject } from "~/actions/invite-actions";
import { redirect } from "next/navigation";
import constructToastURL from "~/lib/global-toast/global-toast-url-constructor";

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
		redirect(`/project/${result.projectId}/backlog`);
	}

	redirect(constructToastURL(result.message, "error"));
}
