import OpenAI from "openai";

const openai = new OpenAI({
	apiKey: "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", // defaults to process.env["OPENAI_API_KEY"]
});

export async function createCompletion() {
	const chatCompletion = await openai.chat.completions.create({
		messages: [
			{
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
			},
			{
				role: "user",
				content:
					"Create a task thats for emailing Brian about his Github credentials so we can add him.",
			},
		],
		model: "gpt-3.5-turbo",
		// response_format: { type: "json_object" },
	});

	return chatCompletion;
}
