import React from "react";

import { getTasksFromProject } from "~/actions/application/task-actions";
import { type Task } from "~/server/db/schema";

import { DataCardFigure } from "./DataCard";

type Props = {
	projectId: number;
};

const Figures = async (props: Props) => {
	const tasks: Task[] = (await getTasksFromProject(props.projectId)) ?? [];
	const backlogTaskCount: number = tasks.filter(
		(task: Task) => task.status === "backlog",
	).length;

	const activeTaskCount: number = tasks.filter(
		(task: Task) => task.status === "inprogress",
	).length;

	const completedTaskCount: number = tasks.filter(
		(task: Task) => task.status === "done",
	).length;

	const totalTaskCount: number = tasks.length;

	return (
		<>
			<DataCardFigure
				cardTitle={backlogTaskCount.toString()}
				cardDescriptionUp="Backlog Tasks"
				cardDescriptionDown=""
			/>
			<DataCardFigure
				cardTitle={activeTaskCount.toString()}
				cardDescriptionUp="In Progress Tasks"
				cardDescriptionDown=""
			/>
			<DataCardFigure
				cardTitle={completedTaskCount.toString()}
				cardDescriptionUp="Done Tasks"
				cardDescriptionDown=""
			/>
			<DataCardFigure
				cardTitle={totalTaskCount.toString()}
				cardDescriptionUp="Total Tasks"
				cardDescriptionDown=""
			/>
		</>
	);
};

export default Figures;
