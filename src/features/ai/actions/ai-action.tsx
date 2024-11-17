"use server";

import OpenAI from "openai";
import { zodResponseFormat } from "openai/helpers/zod";
import { z } from "zod";

import { env } from "~/env.mjs";
import { schemaValidators } from "~/features/tasks/config/taskConfigType";
import { logger } from "~/lib/logger";
import { type User } from "~/schema";

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
		response_format: zodResponseFormat(TaskProperties, "task_properties"),
	});

	try {
		const task_properties = completion.choices[0]?.message.parsed;

		if (!task_properties) {
			console.error("task properties not returned from OpenAI");
			return;
		}

		return task_properties;
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
	try {
		if (description.length === 0) {
			return { success: false, error: "No prompt provided" };
		}

		const loggerContext = {
			projectId,
			assigneeCount: assignees.length,
			descriptionLength: description,
		};
		logger.info(loggerContext, "[AI] Task creator starting generation");

		if (await isAiLimitReached()) {
			logger.warn("[AI] Usage limit reached");
			return { success: false, error: "AI usage limit reached" };
		}

		const Tasks = z.object({
			tasks: z.array(
				z.object({
					title: z.string(),
					description: z.string(),
					status: schemaValidators.status,
					points: schemaValidators.points,
					priority: schemaValidators.priority,
					type: schemaValidators.type,
					assignee: z.string(),
				}),
			),
		});

		const systemOutlinePrompt = `
	You are an expert in agile project management. You are responsible to create a new task or tasks that fulfill the users description. Generally avoid creating too many tasks, unless asked.
	The description can and should use basic markdown! Please only include the following:
	# h1,## h2,### h3,**bold**,*italic*,\`code\`,<u>underline</u>,~~slice~~,[link](https://),---,- bullet list,1. ordered list,- [ ] check list
	\`\`\`
	Code Block
	\`\`\`
	> Quote Block
	`;

		const context = await getMostRecentTasks(projectId, 7);
		const contextFormatted = [
			"title,description,status,points,type,assignee,priority",
			...context.map((item) =>
				[
					item.title,
					truncateDescription(item.description, 20),
					item.status,
					item.points,
					item.type,
					item.assignee,
					item.priority,
				].join(","),
			),
		].join("\n");
		const users = assignees.map((user) => user.username).join(", ");

		const completion = await openai.beta.chat.completions.parse({
			model: "gpt-4o-2024-08-06",
			messages: [
				{
					role: "system",
					content: systemOutlinePrompt,
				},
				{
					role: "user",
					content: description,
				},
				{
					role: "system",
					content: `Context for this users request ${contextFormatted}. The only valid options for assignees are: ${users}`,
				},
			],
			response_format: zodResponseFormat(Tasks, "tasks"),
		});

		const results = completion.choices[0]?.message.parsed;
		if (!results?.tasks?.length) {
			throw new Error("No tasks returned from OpenAI");
		}

		return {
			success: true,
			tasks: results.tasks,
		};
	} catch (error) {
		logger.error(error, "[AI] Task creator");
		return {
			success: false,
			error:
				error instanceof Error
					? error.message
					: "Unknown error occurred",
		};
	}
}
