import { type Metadata } from "next";
import { redirect } from "next/navigation";

import { joinProject } from "~/actions/onboarding/invite-actions";
import constructToastURL from "~/lib/toast/global-toast-url-constructor";

export const metadata: Metadata = {
	title: "Join Project",
};

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
		redirect(`/project/${result.projectId}/tasks`);
	}

	redirect(constructToastURL(result.message, "error"));
}
