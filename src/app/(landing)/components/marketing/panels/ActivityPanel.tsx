import React from "react";

import { subMinutes } from "date-fns";

import TaskHistoryItem, {
	type TaskHistoryWithUser,
} from "~/components/task/HistoryItem";

const firstActivity: TaskHistoryWithUser = {
	id: 1,
	comment: " created the task.",
	taskId: 1,
	propertyKey: "assignee",
	propertyValue: "Casey Johnson",
	oldPropertyValue: null,
	userId: "2",
	insertedDate: subMinutes(new Date(), 5),
	user: {
		userId: "2",
		username: "Casey Johnson",
		profilePicture: "/static/profiles/p2.png",
	},
};

const ActivityPanel = () => {
	return (
		<div className="pb-4 mix-blend-overlay">
			<div className="flex flex-col gap-4 overflow-hidden mix-blend-lighten">
				<div className="ease-slow transition-all duration-300 group-hover:-translate-y-[122%] group-hover:scale-0 group-hover:opacity-0">
					<TaskHistoryItem history={firstActivity} />
				</div>
				<div className="ease-slow transition-all duration-300 group-hover:-translate-y-[122%]">
					<TaskHistoryItem history={firstActivity} />
				</div>
				<div className="ease-slow transition-all duration-300 group-hover:-translate-y-[122%]">
					<TaskHistoryItem history={firstActivity} />
				</div>
				<div className="ease-slow scale-0 opacity-0 transition-all duration-300 group-hover:-translate-y-[122%] group-hover:scale-100 group-hover:opacity-100">
					<TaskHistoryItem history={firstActivity} />
				</div>
			</div>
		</div>
	);
};

export default ActivityPanel;
