"use server";

import { addWeeks } from "date-fns";
import { asc, eq } from "drizzle-orm";
import { db } from "~/server/db";
import { projects, sprints } from "~/server/db/schema";

export async function createSprintforProject(projectId: number) {
	const currSprints = await db
		.select()
		.from(sprints)
		.where(eq(sprints.projectId, projectId))
		.orderBy(asc(sprints.endDate))
		.limit(1);
	const currprojects = await db
		.select()
		.from(projects)
		.where(eq(projects.id, projectId));

	const currproject = currprojects[0];

	if (!currproject) {
		return;
	}

	if (!currSprints.length) {
		await db.insert(sprints).values([
			{
				projectId: projectId,
				startDate: currproject.sprintStart,
				endDate: addWeeks(
					currproject.sprintStart,
					currproject.sprintDuration,
				),
			},
			{
				projectId: projectId,
				startDate: addWeeks(
					currproject.sprintStart,
					currproject.sprintDuration,
				),
				endDate: addWeeks(
					currproject.sprintStart,
					currproject.sprintDuration * 2,
				),
			},
		]);
		return;
	}

	const currSprint = currSprints[0];
	if (!currSprint) {
		return;
	}

	await db.insert(sprints).values({
		projectId: projectId,
		startDate: currSprint.endDate,
		endDate: addWeeks(currSprint.endDate, currproject.sprintDuration),
	});

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
