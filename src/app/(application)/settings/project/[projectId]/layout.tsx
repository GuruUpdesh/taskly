import React from "react";

import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

import { getProject } from "~/actions/application/project-actions";
import constructToastURL from "~/lib/toast/global-toast-url-constructor";

type Params = {
	children: React.ReactNode;
	params: {
		projectId: string;
	};
};

export default async function ProjectSettingsLayout({
	children,
	params: { projectId },
}: Params) {
	const user = await currentUser();
	if (!user) {
		redirect(
			constructToastURL(
				"You need to be logged in to view project settings",
				"error",
			),
		);
	}

	const projectIdInt = parseInt(projectId, 10);
	const result = await getProject(projectIdInt, user.id);
	if (result.error !== null) {
		redirect(constructToastURL(result.error, "error"));
	}

	return (
		<div className="mx-4 flex w-[700px] flex-col gap-8 py-6 pt-8">
			{children}
		</div>
	);
}
