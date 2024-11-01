"use server";

import OpenAI from "openai";
import { zodResponseFormat } from "openai/helpers/zod";
import { z } from "zod";

import {
	getCurrentSprintForProject,
} from "~/actions/sprint-actions";
import { env } from "~/env.mjs";
import { schemaValidators } from "~/features/tasks/config/taskConfigType";
import { type User } from "~/server/db/schema";

import { isAiLimitReached } from "./ai-limit-actions";
import { getMostRecentTasks } from "../../../actions/task-views-actions";

const openai = new OpenAI({
	apiKey: env.OPENAI_API_KEY,
});

export async function aiAction(
	title: string,
	description: string,
	assignees: User[],
) {
	if (await isAiLimitReached()) {
		return;
	}

	const TaskProperties = z.object({
		status: schemaValidators.status,
		points: schemaValidators.points,
		priority: schemaValidators.priority,
		type: schemaValidators.type,
		assignee: z.string(),
	});

	const users = assignees.map((user) => user.username).join(", ");
	// eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-assignment
	const completion = await openai.beta.chat.completions.parse({
		model: "gpt-4o-2024-08-06",
		messages: [
			{
				role: "system",
				content: `You are an expert in evaluating task information and assigning appropriate properties. The potential values for assignee are: ${users}`,
			},
			{
				role: "user",
				content: `What properties should I assign my task "${title}" which is described as: "${description}".`,
			},
		],
		// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
		response_format: zodResponseFormat(TaskProperties, "task_properties"),
	});

	try {
		// eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-assignment
		const task_properties = completion.choices[0]?.message.parsed;

		if (!task_properties) {
			console.error("task properties not returned from OpenAI");
			return;
		}

		const validated_properties = TaskProperties.parse(task_properties);
		return validated_properties;
	} catch (e) {
		console.error(e);
		return;
	}
}

const truncateDescription = (description: string, maxLength: number) => {
	if (description.length > maxLength) {
		return description.substring(0, maxLength) + "...";
	}
	return description;
};

export async function aiGenerateTask(
	description: string,
	projectId: number,
	assignees: User[],
) {
	console.time("AI TASK CREATION");
	if (await isAiLimitReached()) {
		return;
	}

	// setup validator
	const Tasks = z.array(
		z.object({
			title: z.string(),
			description: z.string(),
			status: schemaValidators.status,
			points: schemaValidators.points,
			priority: schemaValidators.priority,
			type: schemaValidators.type,
			assignee: z.string(),
			sprintId: z.string(),
		}),
	);

	const TaskReasoning = z.object({
		tasks: Tasks,
	});

	// define the messages to be passed to open ai
	const users = assignees.map((user) => user.username).join(", ");
	const currentSprint = await getCurrentSprintForProject(projectId);
	const systemMessage = `
		You are an expert in creating tasks.
		Depending on the complexity of the situation you can create multiple tasks.
		Typically only do this if explicitly asked by the user.
		Additional Rules:
			* If the status is backlog, there cannot be a sprint.
			* If a sprint is selected, the status cannot be backlog.
			* The description can and should use Markdown to most effectively communicate information!
		The potential values for assignee are: ${users}
		If you assign a sprint it should be the current one: ${currentSprint?.id ?? "[error: there are no sprints]"}
	`;

	const context = await getMostRecentTasks(projectId, 5);
	const formattedContext = context.map(
		(task) =>
			`${task.title}: ${task.status}, ${task.assignee}, ${task.sprintId}, ${task.points}. ${task.type} which is described as ${truncateDescription(task.description, 100)}`,
	);
	const contextMessage = `
		Depending on the the users message you may want to reference the last 5 tasks created in this project.
		${`[${formattedContext.join(",\n")}]`}
	`;

	// send all the data over with the response format
	const completion = await openai.beta.chat.completions.parse({
		model: "gpt-4o-2024-08-06",
		messages: [
			{
				role: "system",
				content: systemMessage,
			},
			{
				role: "system",
				content: contextMessage,
			},
			{
				role: "user",
				content: description,
			},
		],
		response_format: zodResponseFormat(TaskReasoning, "TaskReasoning"),
	});

	try {
		const taskReasoning = completion.choices[0]?.message.parsed;

		if (!taskReasoning) {
			console.error("tasks not returned from OpenAI");
			return;
		}

		const tasks = taskReasoning.tasks;
		console.timeEnd("AI TASK CREATION");
		console.log(
			`AI task creation. Prompt: ${description}:\n Result:`,
			tasks,
		);

		return tasks;
	} catch (e) {
		console.error(e);
		return;
	}
	// if (await isAiLimitReached()) {
	// 	return;
	// }

	// const context = await getMostRecentTasks(projectId, 5);
	// const contextJSON = JSON.stringify(
	// 	context.map((task) => ({
	// 		...task,
	// 		description: truncateDescription(task.description, 100),
	// 	})),
	// );

	// const assignees = await getAssigneesForProject(projectId);
	// if (assignees.error !== null) {
	// 	console.error(assignees.error);
	// 	return;
	// }
	// const sprints = await getSprintsForProject(projectId);

	// const taskSchema = getTaskAiSchema(assignees.data, sprints);

	// const prompt = `
	// RESPOND IN JSON FORMAT!
	// Create a new task for project management. Provide the following details:
	// Description of the task: ${description}

	// If you feel this should be broken up into multiple tasks feel free to do so.
	// Please always return an array of tasks, even if it's just one task.

	// ${taskSchema}

	// The most recent tasks are:
	// ${contextJSON}

	// Additional Rules:
	// 	* If the status is backlog, there cannot be a sprint.
	// 	* If a sprint is selected, the status cannot be backlog.
	// 	* The description can and should use Markdown to most effectively communicate information!
	// `;

	// console.log(prompt);

	// const gptResponse = await openai.chat.completions.create({
	// 	messages: [
	// 		{
	// 			role: "assistant",
	// 			content: prompt,
	// 		},
	// 	],
	// 	model: "gpt-4o",
	// });

	// if (!gptResponse.choices[0]?.message.content) {
	// 	return "";
	// }

	// const jsonString = gptResponse.choices[0]?.message.content;
	// const jsonStart = jsonString.indexOf("[");
	// const jsonEnd = jsonString.lastIndexOf("]") + 1;

	// return jsonString.substring(jsonStart, jsonEnd);
}
