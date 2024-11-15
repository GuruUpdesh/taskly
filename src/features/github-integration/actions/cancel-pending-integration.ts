"use server";

import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { z } from "zod";

import { db } from "~/db";
import { projectToIntegrations } from "~/schema";

export async function cancelPendingIntegration(formData: FormData) {
	const id = formData.get("integrationId");
	if (!id) {
		return;
	}
	const integrationId = z.number().parse(parseInt(id as string, 10));
	await db
		.delete(projectToIntegrations)
		.where(eq(projectToIntegrations.id, integrationId));

	revalidatePath("/");
}
