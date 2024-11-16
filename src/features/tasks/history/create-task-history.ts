import { authenticate } from "~/actions/security/authenticate";
import { type UpdateTaskData } from "~/actions/task-actions";
import { db } from "~/db";
import { insertTaskHistorySchema, type Task, taskHistory } from "~/schema";

// task object keys that will non be included in task history
const excludedKeys = [
	"lastEditedAt",
	"insertedDate",
	"backlogOrder",
	"id",
	"title",
	"description",
];

export async function createTaskHistory(
	taskId: number,
	incomingTaskData: UpdateTaskData,
	existingTask: Task,
) {
	const userId = await authenticate();

	// normalize the incoming data
	const existingTaskTransformed = {
		...existingTask,
		sprintId: String(existingTask.sprintId),
	};

	if (existingTaskTransformed.assignee === null) {
		existingTaskTransformed.assignee = "unassigned";
	}

	const newActivity = [];
	// loop through the keys to identify changes
	for (const key in incomingTaskData) {
		const value = incomingTaskData[key as keyof typeof incomingTaskData];
		if (value === undefined || excludedKeys.includes(key)) continue;

		const newHistoryItem = {
			taskId: taskId,
			propertyKey: key,
			propertyValue: String(value),
			oldPropertyValue: String(
				existingTaskTransformed[key as keyof Task],
			),
			userId: userId,
			insertedDate: new Date(),
		};

		const validatedItem = insertTaskHistorySchema.parse(newHistoryItem);
		newActivity.push(validatedItem);
	}

	await db.insert(taskHistory).values(newActivity);
}
