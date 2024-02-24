import { startOfYesterday } from "date-fns";
import { eq } from "drizzle-orm";
import type { NextRequest } from "next/server";
import { createSprintForProject } from "~/actions/application/sprint-actions";
import { env } from "~/env.mjs";
import { db } from "~/server/db";
import { sprints } from "~/server/db/schema";

export async function GET(request: NextRequest) {
	const authHeader = request.headers.get("authorization");
	if (authHeader !== `Bearer ${env.CRON_SECRET}`) {
		return new Response("Unauthorized", {
			status: 401,
		});
	}

	const expiredSprints = await db
		.select()
		.from(sprints)
		.where(eq(sprints.endDate, startOfYesterday()));

	const promises = [];
	for (const sprint of expiredSprints) {
		const projectId = sprint.projectId;
		promises.push(createSprintForProject(projectId));
	}

	await Promise.all(promises);
}
