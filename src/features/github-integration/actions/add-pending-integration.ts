"use server";

import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

import { db } from "~/server/db";
import {
	projectToIntegrations,
	projectToIntegrationsSchema,
} from "~/server/db/schema";

import { authenticate } from "../../../actions/security/authenticate";

export async function addPendingIntegration(
	projectId: number,
	integrationId: string,
) {
	const userId = authenticate();
	const data = { projectId, integrationId, userId };

	console.log("GitHub Integration: addPendingIntegration", data);
	const validData = projectToIntegrationsSchema
		.pick({ projectId: true, integrationId: true, userId: true })
		.parse(data);

	const currentPendingIntegration =
		await db.query.projectToIntegrations.findFirst({
			where: (projectToIntegrations) =>
				eq(projectToIntegrations.userId, userId) &&
				eq(projectToIntegrations.integrationId, "github"),
		});

	if (currentPendingIntegration) {
		await db
			.update(projectToIntegrations)
			.set(validData)
			.where(eq(projectToIntegrations.userId, userId));
		return;
	}

	await db.insert(projectToIntegrations).values(validData);

	revalidatePath("/");
}
