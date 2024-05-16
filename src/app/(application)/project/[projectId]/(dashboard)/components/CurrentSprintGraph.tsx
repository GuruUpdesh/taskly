"use server";

import React from "react";

import { format, addDays, isBefore, startOfDay, isAfter } from "date-fns";
import { and, eq, gte, lte } from "drizzle-orm";

import { db } from "~/server/db";
import { sprints } from "~/server/db/schema";
import { getCurrentSprintId } from "~/utils/getCurrentSprintId";

import { DataCardAreaGraph, type Result } from "./DataCard";

type Props = {
	projectId: number;
};

const CurrentSprintGraph = async ({ projectId }: Props) => {
	const projectSprints = await db
		.select()
		.from(sprints)
		.where(eq(sprints.projectId, projectId));
	const currentSprintId = getCurrentSprintId(
		projectSprints.map((sprint) => ({ ...sprint, name: `${sprint.id}` })),
	);
	const currentSprint = projectSprints.find(
		(sprint) => sprint.id === currentSprintId,
	);

	if (!currentSprint) {
		console.warn("No active sprint found.");
		return;
	}

	const taskHistoryEntries = await db.query.taskHistory.findMany({
		where: (th) =>
			and(
				eq(th.propertyKey, "status"),
				gte(th.insertedDate, currentSprint.startDate),
				lte(th.insertedDate, currentSprint.endDate),
			),
		with: {
			task: true,
		},
	});

	const totalSprintPoints = taskHistoryEntries.reduce((sum, th) => {
		return sum + (parseInt(th.task.points, 10) || 0);
	}, 0);

	// build area graph data
	const dateArray = [];
	let currentDate = addDays(startOfDay(currentSprint.startDate), -1);

	while (
		isBefore(currentDate, startOfDay(currentSprint.endDate)) ||
		currentDate.getTime() === startOfDay(currentSprint.endDate).getTime()
	) {
		dateArray.push(currentDate);
		currentDate = addDays(currentDate, 1);
	}

	// Initialize cumulative count
	let cumulativeInProgressCount = 0;
	let cumulativeDoneCount = 0;

	const optimalIncrement = totalSprintPoints / (dateArray.length - 1);
	const areaChartData = dateArray.map((date, index) => {
		// Filter task history entries for the current date
		const tasksForDate = taskHistoryEntries.filter(
			(th) => startOfDay(th.insertedDate).getTime() === date.getTime(),
		);

		// sum up the task points for the current date
		tasksForDate.forEach((th) => {
			const points = parseInt(th.task.points, 10) || 0;
			if (
				th.propertyValue === "inprogress" ||
				th.propertyValue === "inreview"
			) {
				cumulativeInProgressCount += points;
			} else if (th.propertyValue === "done") {
				cumulativeDoneCount += points;
			}
		});



		const result: Result = {
			date: format(date, "MMM d"),
			points: Math.ceil(index * optimalIncrement),
		};

		if (!isAfter(date, new Date())) {
			result.inProgress = cumulativeInProgressCount;
			result.done = cumulativeDoneCount;
		}

		return result;
	});
	return <DataCardAreaGraph title="In-Progress Tasks" data={areaChartData} />;
};

export default CurrentSprintGraph;
