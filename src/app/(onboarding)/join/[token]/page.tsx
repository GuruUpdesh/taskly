import { redirect } from "next/navigation";

import { joinProject } from "~/actions/onboarding/invite-actions";
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
	const result = await joinProject(decodedToken);

	if (result.success && result.projectId) {
		redirect(`/project/${result.projectId}/backlog`);
	}

	redirect(constructToastURL(result.message, "error"));
}
