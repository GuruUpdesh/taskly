"use server";

import React from "react";

import { format, addDays, isBefore, startOfDay, isAfter } from "date-fns";
import { and, eq, inArray } from "drizzle-orm";
import dynamic from "next/dynamic";

import { Skeleton } from "~/components/ui/skeleton";
import { db } from "~/server/db";
import { sprints, tasks } from "~/server/db/schema";
import { getCurrentSprintId } from "~/utils/getCurrentSprintId";

import { type Result } from "./CurrentSprintAreaGraph";
const CurrentSprintAreaGraph = dynamic(
	() => import("./CurrentSprintAreaGraph"),
	{
		ssr: false,
		loading: () => (
			<Skeleton className="col-span-4 h-[316px] 2xl:col-span-2" />
		),
	},
);

type Props = {
	projectId: number;
};

function getMaxDate(date1: Date | null, date2: Date | null): Date {
	if (date1 === null && date2 === null) {
		return new Date();
	}
	if (date1 === null) {
		return date2!;
	}
	if (date2 === null) {
		return date1;
	}
	return date1 > date2 ? date1 : date2;
}

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

	const sprintTasksRaw = await db
		.select({
			id: tasks.id,
			status: tasks.status,
			points: tasks.points,
			insertDate: tasks.insertedDate,
			editedDate: tasks.lastEditedAt,
		})
		.from(tasks)
		.where(
			and(
				eq(tasks.projectId, projectId),
				eq(tasks.sprintId, currentSprint.id),
			),
		);
	const sprintTasks = sprintTasksRaw.map((task) => ({
		...task,
		insertDate: getMaxDate(task.insertDate, task.editedDate),
	}));
	const taskIdArray = sprintTasks.map((task) => task.id);
	if (taskIdArray.length === 0) {
		return;
	}

	const taskHistoryEntries = await db.query.taskHistory.findMany({
		where: (th) =>
			and(eq(th.propertyKey, "status"), inArray(th.taskId, taskIdArray)),
		with: {
			task: true,
		},
		orderBy: (th, { desc }) => [desc(th.insertedDate)],
	});

	const totalSprintPoints = sprintTasks.reduce((sum, t) => {
		return sum + (parseInt(t.points, 10) || 0);
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
	const processedTaskIds = new Set<number>();
	const areaChartData = dateArray.map((date, index) => {
		// Filter task history entries for the current date
		const taskHistoryForDate = taskHistoryEntries.filter(
			(th) => startOfDay(th.insertedDate).getTime() === date.getTime(),
		);

		const taskIdsInHistory = taskHistoryForDate.map((th) => th.task.id);
		const tasksForDate = sprintTasks
			.filter(
				(task) =>
					startOfDay(task.insertDate).getTime() === date.getTime(),
			)
			.filter(
				(task) =>
					!taskIdsInHistory.includes(task.id) &&
					!processedTaskIds.has(task.id),
			);

		// sum up the task points for the current date
		taskHistoryForDate.forEach((th) => {
			const points = parseInt(th.task.points, 10) || 0;
			if (processedTaskIds.has(th.task.id)) {
				return;
			}
			if (
				(th.propertyValue === "inprogress" &&
					th.task.status === "inprogress") ||
				(th.propertyValue === "inreview" &&
					th.task.status === "inreview") ||
				th.task.status === "inprogress" ||
				th.task.status === "inreview"
			) {
				processedTaskIds.add(th.task.id);
				cumulativeInProgressCount += points;
			} else if (
				(th.propertyValue === "done" && th.task.status === "done") ||
				th.task.status === "done"
			) {
				processedTaskIds.add(th.task.id);
				cumulativeDoneCount += points;
			}
		});

		tasksForDate.forEach((task) => {
			const points = parseInt(task.points, 10) || 0;
			if (task.status === "inprogress" || task.status === "inreview") {
				processedTaskIds.add(task.id);
				cumulativeInProgressCount += points;
			} else if (task.status === "done") {
				processedTaskIds.add(task.id);
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

	return (
		<CurrentSprintAreaGraph
			data={areaChartData}
			currentSprint={{ ...currentSprint, name: "cur" }}
		/>
	);
};

export default CurrentSprintGraph;
