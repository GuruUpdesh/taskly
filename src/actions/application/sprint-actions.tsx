"use server";

import { auth } from "@clerk/nextjs/server";
import { addWeeks } from "date-fns";
import { and, asc, eq, gte, lt } from "drizzle-orm";
import { revalidatePath } from "next/cache";

import { env } from "~/env.mjs";
import { db } from "~/server/db";
import { projects, sprints, usersToProjects } from "~/server/db/schema";
import buildUrl from "~/utils/buildUrl";

export async function createSprintForProject() {
	await fetch(buildUrl("/api/cron/sprint"), {
		method: "GET",
		headers: {
			authorization: "Bearer " + env.CRON_SECRET,
		},
	});

	revalidatePath(`/`);

	return;
}

export async function getSprintsForProject(projectId: number) {
	const allSprints = await db
		.select()
		.from(sprints)
		.where(eq(sprints.projectId, projectId));

	return allSprints.map((sprint, index) => ({
		name: `Sprint ${index + 1}`,
		...sprint,
	}));
}

export async function getCurrentSprintForProject(projectId: number) {
	const currentSprints = await db
		.select()
		.from(sprints)
		.where(
			and(
				eq(sprints.projectId, projectId),
				gte(sprints.endDate, new Date()),
				lt(sprints.startDate, new Date()),
			),
		)
		.orderBy(asc(sprints.endDate))
		.limit(1);

	return currentSprints[0];
}

export async function updateSprintsForProject(
	projectId: number,
	sprintDuration: number,
	sprintStart: Date,
) {
	// authenticate
	const { userId } = auth();
	if (!userId) {
		return false;
	}

	// check if user is related to project
	const userRelatedToProject = await db
		.select()
		.from(usersToProjects)
		.where(
			and(
				eq(usersToProjects.userId, userId),
				eq(usersToProjects.projectId, projectId),
			),
		);

	if (!userRelatedToProject?.length) {
		return false;
	}

	// update project
	await db
		.update(projects)
		.set({
			sprintDuration,
			sprintStart,
		})
		.where(eq(projects.id, projectId));

	const currentAndFutureSprints = await db
		.select()
		.from(sprints)
		.where(
			and(
				eq(sprints.projectId, projectId),
				gte(sprints.endDate, new Date()),
			),
		);

	await db.transaction(async (tx) => {
		let counter = 0;
		for (const sprint of currentAndFutureSprints) {
			await tx
				.update(sprints)
				.set({
					startDate: addWeeks(sprintStart, counter * sprintDuration),
					endDate: addWeeks(
						sprintStart,
						(counter + 1) * sprintDuration,
					),
				})
				.where(eq(sprints.id, sprint.id));
			counter++;
		}
	});

	await createSprintForProject();

	revalidatePath(`/`);

	return true;
}
