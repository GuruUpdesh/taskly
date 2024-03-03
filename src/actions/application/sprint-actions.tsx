"use server";

import { auth } from "@clerk/nextjs";
import { addWeeks } from "date-fns";
import { and, asc, desc, eq, gte, lt } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { db } from "~/server/db";
import { projects, sprints, usersToProjects } from "~/server/db/schema";

export async function createSprintForProject(projectId: number) {
	const currentSprints = await db
		.select()
		.from(sprints)
		.where(eq(sprints.projectId, projectId))
		.orderBy(desc(sprints.endDate))
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

export async function getCurrentSprintForProject(projectId: number) {
	const currentSprints = await db
		.select()
		.from(sprints)
		.where(
			and(
				eq(sprints.projectId, projectId),
				gte(sprints.endDate, new Date()),
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

	revalidatePath(`/`);

	return true;
}
