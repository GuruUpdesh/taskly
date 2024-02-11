"use server";

import OpenAI from "openai";
import { env } from "~/env.mjs";
import { type User, insertTaskSchema__required } from "~/server/db/schema";

const openai = new OpenAI({
	apiKey: env.OPENAI_API_KEY,
});

export async function aiAction(
	title: string,
	description: string,
	assignees: User[],
) {
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
            - status: [Specify the status, "todo", "inprogress", or "done"]
            - priority: [Specify the priority "low", "medium", or "high"]
            - type: [Specity the type of task "task", "bug", or "feature]
            - assignee: ${users}

            Example:
            Status: In Progress
            Priority: Medium
            Type: Feature
            Assignee: user1

            Users will send you a title and description and you are to return a JSON object with these fields.
            `,
			},
		],
		model: "gpt-3.5-turbo",
	});

	if (!gptResponse.choices[0]?.message.content) {
		return;
	}
	const response = JSON.parse(
		gptResponse.choices[0]?.message.content,
	) as unknown;
	const validationSchema = insertTaskSchema__required.pick({
		status: true,
		priority: true,
		type: true,
		assignee: true,
	});
	const results = validationSchema.safeParse(response);
	if (!results.success) {
		return;
	}
	return results.data;
}

export async function generateProjectImage(
	name: string,
	description: string | null | undefined,
) {
	const client = new OpenAI();

	const response = await client.images.generate({
		model: "dall-e-3",
		prompt: `Generate a logo for "${name}", "${description}".`,
		n: 1,
		size: "1024x1024",
	});

	const image_url = response?.data?.[0]?.url;
	if (!image_url) {
		return;
	}

	return image_url;
}
