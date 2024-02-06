"use server";

import { addWeeks } from "date-fns";
import { asc, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { db } from "~/server/db";
import { projects, sprints } from "~/server/db/schema";

export async function createSprintForProject(projectId: number) {
	const currentSprints = await db
		.select()
		.from(sprints)
		.where(eq(sprints.projectId, projectId))
		.orderBy(asc(sprints.endDate))
		.limit(1);
	const currentProjects = await db
		.select()
		.from(projects)
		.where(eq(projects.id, projectId));

	const currentProject = currentProjects[0];

	if (!currentProject) {
		return;
	}

	if (!currentSprints.length) {
		await db.insert(sprints).values([
			{
				projectId: projectId,
				startDate: currentProject.sprintStart,
				endDate: addWeeks(
					currentProject.sprintStart,
					currentProject.sprintDuration,
				),
			},
			{
				projectId: projectId,
				startDate: addWeeks(
					currentProject.sprintStart,
					currentProject.sprintDuration,
				),
				endDate: addWeeks(
					currentProject.sprintStart,
					currentProject.sprintDuration * 2,
				),
			},
		]);
		return;
	}

	const currSprint = currentSprints[0];
	if (!currSprint) {
		return;
	}

	await db.insert(sprints).values({
		projectId: projectId,
		startDate: currSprint.endDate,
		endDate: addWeeks(currSprint.endDate, currentProject.sprintDuration),
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
