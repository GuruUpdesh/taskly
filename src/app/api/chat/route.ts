import { OpenAIStream, StreamingTextResponse } from "ai";
import OpenAI from "openai";
import { z } from "zod";

import { getAssigneesForProject } from "~/actions/application/project-actions";
import { getSprintsForProject } from "~/actions/application/sprint-actions";
import { env } from "~/env.mjs";
import { getTaskAiSchema } from "~/utils/ai-context";

export const runtime = "edge";

const openai = new OpenAI({
	apiKey: env.OPENAI_API_KEY,
});

export async function POST(req: Request) {
	console.log("🤖 - Beginning AI task creation");
	const body: unknown = await req.json();
	const schema = z.object({
		projectId: z.string(),
	});
	const { projectId } = schema.parse(body);
	console.log("🤖 - Getting sprints and assignees for project", projectId);
	const assignees = await getAssigneesForProject(parseInt(projectId));
	const sprints = await getSprintsForProject(parseInt(projectId));

	const taskSchema = getTaskAiSchema(assignees, sprints);
	console.error("🤖 - Generated task schema", taskSchema);

	const { messages } = (await req.json()) as {
		messages: OpenAI.ChatCompletionMessageParam[];
	};
	messages.unshift(systemMessage);

	// Request the OpenAI API for the response based on the prompt
	const response = await openai.chat.completions.create({
		model: "gpt-3.5-turbo",
		stream: true,
		messages: messages,
	});
	const stream = OpenAIStream(response);
	return new StreamingTextResponse(stream);
}

const systemMessage: OpenAI.ChatCompletionMessageParam = {
	role: "system",
	content: `
	RESPOND IN JSON FORMAT!
	
    Create a new task for project management. Provide the following details:
    - title: [Specify the title of the task]
    - description: [Include a brief description of the task]
    - status: [Specify the status, "backlog", "todo", "inprogress", "inreview", or "done"]
	- points: [Specify the points "0", "1", "2", "3", "4", or "5"]
	- priority: [Specify the priority "none", "low", "medium", "high", or "critical"]
	- type: [Specity the type of task "task", "bug", "feature", "improvement", "research", or "testing"]
    
    Example:
    Title: Develop Feature XYZ
    Description: Implement new functionality according to specifications.
    Status: In Progress
    Priority: Medium
    Type: Feature
	
    
    Users will send you a description and you are to return a JSON object with these fields.
    `,
};
