"use server";

import { auth } from "@clerk/nextjs/server";
import { addWeeks } from "date-fns";
import { and, asc, eq, gte, inArray, lt, type SQL, sql } from "drizzle-orm";
import { revalidatePath } from "next/cache";

import { db } from "~/db";
import { env } from "~/env.mjs";
import { projects, sprints, usersToProjects } from "~/schema";
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
	const { userId } = await auth();
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

	const startDateSqlChunks: SQL[] = [];
	const endDateSqlChunks: SQL[] = [];
	const ids: number[] = [];

	let counter = 0;

	startDateSqlChunks.push(sql`cast((case`);
	endDateSqlChunks.push(sql`cast((case`);

	for (const sprint of currentAndFutureSprints) {
		const newSprintStartDate = addWeeks(
			sprintStart,
			counter * sprintDuration,
		);
		const newSprintEndDate = addWeeks(
			sprintStart,
			(counter + 1) * sprintDuration,
		);

		startDateSqlChunks.push(
			sql`when ${sprints.id} = ${sprint.id} then ${newSprintStartDate}`,
		);
		endDateSqlChunks.push(
			sql`when ${sprints.id} = ${sprint.id} then ${newSprintEndDate}`,
		);

		ids.push(sprint.id);

		counter++;
	}

	startDateSqlChunks.push(sql`end) as date)`);
	endDateSqlChunks.push(sql`end) as date)`);

	const finalStartDateSql: SQL = sql.join(startDateSqlChunks, sql.raw(" "));
	const finalEndDateSql: SQL = sql.join(endDateSqlChunks, sql.raw(" "));

	const query = db
		.update(sprints)
		.set({ startDate: finalStartDateSql, endDate: finalEndDateSql })
		.where(inArray(sprints.id, ids));

	await query.execute();

	await createSprintForProject();

	revalidatePath(`/`);

	return true;
}
