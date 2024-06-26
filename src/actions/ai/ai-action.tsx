"use server";

import OpenAI from "openai";
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
	const users = assignees.map((user) => user.username).join(", ");
	const gptResponse = await openai.chat.completions.create({
		messages: [
			{
				role: "assistant",
				content: `
            RESPOND IN JSON FORMAT!

            A user is trying to create a new task with the title "${title}".

            Create a new task for the user with the title "${title}" and the description "${description}" that they provided.

            Provide the following details:
            - status: [Specify the status, "backlog", "todo", "inprogress", "inreview", or "done"]
			- points: [Specify the points "0", "1", "2", "3", "4", or "5"] as a string
            - priority: [Specify the priority "none", "low", "medium", "high", or "critical"]
            - type: [Specity the type of task "task", "bug", "feature", "improvement", "research", or "testing"]
            - assignee: ${users}

			If no title was provided but a description was provided, use also generate a concise title for the task.

            Example:
            Status: In Progress
			Points: 3
            Priority: Medium
            Type: Feature
            Assignee: user1

            Users will send you a title and description and you are to return a JSON object with these fields.
            `,
			},
		],
		model: "gpt-4o",
	});
	if (!gptResponse.choices[0]?.message.content) {
		return;
	}
	const response = JSON.parse(
		gptResponse.choices[0]?.message.content,
	) as unknown;
	console.log(response);
	const validationSchema = z.object({
		title: schemaValidators.title,
		description: schemaValidators.description,
		status: schemaValidators.status,
		points: schemaValidators.points,
		priority: schemaValidators.priority,
		type: schemaValidators.type,
		assignee: schemaValidators.assignee,
	});
	const results = validationSchema.safeParse(response);
	if (!results.success) {
		console.error(results.error);
		return;
	}
	return results.data;
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
