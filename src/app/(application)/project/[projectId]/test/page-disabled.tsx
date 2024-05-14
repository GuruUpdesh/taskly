import React from "react";

import { getAssigneesForProject } from "~/actions/application/project-actions";
import { getSprintsForProject } from "~/actions/application/sprint-actions";
import { getTasksFromProject } from "~/actions/application/task-actions";
import TaskProperty from "~/app/(application)/project/[projectId]/task/[taskId]/components/TaskProperty";
import { getPropertyConfig, taskProperties } from "~/config/taskConfigType";

type Params = {
	params: {
		projectId: string;
	};
};

async function TaskPage({ params: { projectId } }: Params) {
	const projectIdInt = parseInt(projectId, 10);
	const tasks = await getTasksFromProject(projectIdInt);
	const assigneeResult = await getAssigneesForProject(projectIdInt);
	if (assigneeResult.error !== null) {
		console.error(assigneeResult.error);
		return null;
	}
	const assignees = assigneeResult.data;

	const sprints = await getSprintsForProject(projectIdInt);

	if (!tasks) return null;
	return (
		<div>
			{tasks.map((task, idx) => {
				return (
					<div key={idx} className="flex items-center gap-4">
						{taskProperties.map((key) => {
							if (!taskProperties.includes(key)) return null;

							const config = getPropertyConfig(
								key,
								assignees,
								sprints,
							);
							if (
								config.type !== "enum" &&
								config.type !== "dynamic"
							)
								return null;

							const options = config.options;

							return (
								<div
									key={key}
									className="flex flex-col items-center gap-2"
								>
									<h1 className="text-lg font-bold">
										{config.displayName}
									</h1>
									{options.map((option) => {
										return (
											<TaskProperty
												key={option.key}
												option={option}
												size="default"
											/>
										);
									})}
								</div>
							);
						})}
					</div>
				);
			})}
		</div>
	);
}

export default TaskPage;
