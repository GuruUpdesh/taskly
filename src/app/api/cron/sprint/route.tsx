import { addWeeks } from "date-fns";
import { and, asc, desc, eq, ne } from "drizzle-orm";
import type { NextRequest } from "next/server";

import { env } from "~/env.mjs";
import { db } from "~/server/db";
import { projects, sprints, tasks } from "~/server/db/schema";

type Sprint =
	| {
			id: number;
			startDate: Date;
			endDate: Date;
	  }
	| undefined;

async function createSprintForProject(projectId: number) {
	// get current project for sprint settings
	const currentProjects = await db
		.select()
		.from(projects)
		.where(eq(projects.id, projectId));

	const currentProject = currentProjects[0];

	if (!currentProject) {
		console.error(
			"Attempted to create sprint for non-existent project",
			projectId,
		);
		return;
	}

	// initialize sprint start to project start
	let newSprintStart = currentProject.sprintStart;

	// get the last sprint for the project
	const currentSprints = await db
		.select()
		.from(sprints)
		.where(eq(sprints.projectId, projectId))
		.orderBy(desc(sprints.endDate))
		.limit(1);

	const lastSprint = currentSprints[0];
	if (lastSprint) {
		// if there is a last sprint, set the new sprint start to the last sprint end
		newSprintStart = lastSprint.endDate;
	}

	// add sprint duration to get the new sprint end
	const newSprintEnd = addWeeks(
		newSprintStart,
		currentProject.sprintDuration,
	);
	const newSprint = {
		projectId: projectId,
		startDate: newSprintStart,
		endDate: newSprintEnd,
	};

	await db.insert(sprints).values(newSprint);

	return newSprint;
}

type Results = Record<number, Omit<Sprint, "id">[]>;

export async function GET(request: NextRequest) {
	const authHeader = request.headers.get("authorization");
	if (authHeader !== `Bearer ${env.CRON_SECRET}`) {
		return new Response("Unauthorized", {
			status: 401,
		});
	}

	const allProjects = await db.select().from(projects);
	const results: Results = {};

	for (const project of allProjects) {
		const projectId = project.id;
		results[projectId] = [];

		while (true) {
			const sprintsForProject = await db
				.select()
				.from(sprints)
				.where(eq(sprints.projectId, projectId))
				.orderBy(asc(sprints.endDate));

			const currentSprintIndex = sprintsForProject.findIndex(
				(sprint) =>
					sprint.startDate <= new Date() &&
					sprint.endDate >= new Date(),
			);

			if (currentSprintIndex !== -1) {
				const nextSprintsCount =
					sprintsForProject.length - 1 - currentSprintIndex;

				if (nextSprintsCount === 0) {
					const newSprint = await createSprintForProject(projectId);
					if (newSprint) {
						results[projectId]?.push({
							startDate: newSprint.startDate,
							endDate: newSprint.endDate,
						});
					}
					break;
				} else {
					break;
				}
			} else {
				const firstSprint = sprintsForProject[0];
				if (firstSprint && firstSprint.endDate > new Date()) {
					break;
				}
				const newSprint = await createSprintForProject(projectId);
				if (newSprint) {
					results[projectId]?.push({
						startDate: newSprint.startDate,
						endDate: newSprint.endDate,
					});
					continue;
				}
			}
		}
	}

	// update non-finished tasks of current sprint to backlog
	for (const project of allProjects) {
		const projectId = project.id;
		console.log("------------------\n\n");
		console.log(projectId, project.name);

		const sprintsForProject = await db
			.select()
			.from(sprints)
			.where(eq(sprints.projectId, projectId))
			.orderBy(asc(sprints.endDate));

		const currentSprintIndex = sprintsForProject.findIndex(
			(sprint) =>
				sprint.startDate <= new Date() && sprint.endDate >= new Date(),
		);
		const currentSprint = sprintsForProject[currentSprintIndex];

		if (!currentSprint) {
			continue;
		}

		await db
			.update(tasks)
			.set({ status: "backlog", sprintId: -1 })
			.where(
				and(
					eq(tasks.projectId, projectId),
					ne(tasks.status, "done"),
					ne(tasks.status, "backlog"),
					ne(tasks.sprintId, currentSprint.id),
					ne(tasks.sprintId, -1),
				),
			);
	}
	return new Response(JSON.stringify(results), { status: 200 });
}
