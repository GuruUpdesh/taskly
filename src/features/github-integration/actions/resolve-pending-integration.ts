"use server";

import { eq } from "drizzle-orm";

import { db } from "~/server/db";
import { projectToIntegrations, projects } from "~/server/db/schema";

import { authenticate } from "../../../actions/security/authenticate";

export async function resolvePendingIntegration(installationId: number) {
	console.log(
		"GitHub Integration: resolvePendingIntegration",
		installationId,
	);
	const userId = authenticate();
	const pendingIntegration = await db.query.projectToIntegrations.findFirst({
		where: (projectToIntegrations) =>
			eq(projectToIntegrations.userId, userId) &&
			eq(projectToIntegrations.integrationId, "github"),
	});
	console.log(
		"GitHub Integration: resolvePendingIntegration",
		pendingIntegration,
	);

	if (!pendingIntegration) {
		return;
	}

	await db
		.update(projects)
		.set({ githubIntegrationId: installationId })
		.where(eq(projects.id, pendingIntegration.projectId));
	await db
		.delete(projectToIntegrations)
		.where(eq(projectToIntegrations.userId, userId));
}
