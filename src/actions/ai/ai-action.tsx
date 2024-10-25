"use server";

import OpenAI from "openai";
import { zodResponseFormat } from "openai/helpers/zod";
import { z } from "zod";

import { getAssigneesForProject } from "~/actions/application/project-actions";
import { getSprintsForProject } from "~/actions/application/sprint-actions";
import { schemaValidators } from "~/config/taskConfigType";
import { env } from "~/env.mjs";
import { type User } from "~/server/db/schema";
import { getTaskAiSchema } from "~/utils/ai-context";

import { isAiLimitReached } from "./ai-limit-actions";
import { getMostRecentTasks } from "../application/task-views-actions";

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

export async function aiGenerateTask(description: string, projectId: number) {
	if (await isAiLimitReached()) {
		return;
	}

	const context = await getMostRecentTasks(projectId, 5);
	const contextJSON = JSON.stringify(
		context.map((task) => ({
			...task,
			description: truncateDescription(task.description, 100),
		})),
	);

	const assignees = await getAssigneesForProject(projectId);
	if (assignees.error !== null) {
		console.error(assignees.error);
		return;
	}
	const sprints = await getSprintsForProject(projectId);

	const taskSchema = getTaskAiSchema(assignees.data, sprints);

	const prompt = `
	RESPOND IN JSON FORMAT!
	Create a new task for project management. Provide the following details:
	Description of the task: ${description}
	
	If you feel this should be broken up into multiple tasks feel free to do so.
	Please always return an array of tasks, even if it's just one task.

	${taskSchema}

	The most recent tasks are:
	${contextJSON}

	Note:
		1. If the status is backlog, there cannot be a sprint.
		2. If a sprint is selected, the status cannot be backlog.
		3. The description can and should use basic markdown!
			This includes: **bold**, #h1, ##h2, ###h3, *italic*, code (slanted quotes), <u>underlined</u>, [link](https://... "title), divider: ***
	`;

	console.log(prompt);

	const gptResponse = await openai.chat.completions.create({
		messages: [
			{
				role: "assistant",
				content: prompt,
			},
		],
		model: "gpt-4o",
	});

	if (!gptResponse.choices[0]?.message.content) {
		return "";
	}

	const jsonString = gptResponse.choices[0]?.message.content;
	const jsonStart = jsonString.indexOf("[");
	const jsonEnd = jsonString.lastIndexOf("]") + 1;

	return jsonString.substring(jsonStart, jsonEnd);
}
