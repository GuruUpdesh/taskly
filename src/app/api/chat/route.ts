import OpenAI from "openai";
import { OpenAIStream, StreamingTextResponse } from "ai";
import { env } from "~/env.mjs";

export const runtime = "edge";

const openai = new OpenAI({
	apiKey: env.OPENAI_API_KEY,
});

export async function POST(req: Request) {
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
    Create a new task for project management. Provide the following details:
    - title: [Specify the title of the task]
    - description: [Include a brief description of the task]
    - status: [Specify the status, "todo", "inprogress", or "done"]
    - priority: [Specify the priority "low", "medium", or "high"]
    - type: [Specity the type of task "task", "bug", or "feature]
    
    Example:
    Title: Develop Feature XYZ
    Description: Implement new functionality according to specifications.
    Status: In Progress
    Priority: Medium
    Type: Feature
    
    Users will send you a description and you are to retun a JSON object with these fields.
    `,
};
