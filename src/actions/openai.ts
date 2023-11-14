import OpenAI from 'openai';

const openai = new OpenAI({
    apiKey: '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', // defaults to process.env["OPENAI_API_KEY"]
});
  

export async function createCompletion() {
    const chatCompletion = await openai.chat.completions.create({
        messages: [
            { role: 'system', 
            content: `
            Create a new task for project management. Provide the following details:
            - Title: [Specify the title of the task]
            - Description: [Include a brief description of the task]
            - To-Do Status: [Specify the status, e.g., "To Do," "In Progress," "Completed"]
            - Medium: [Specify the medium or platform for the task, e.g., "Email," "Chat," "Meeting"]
            - Deadline: [If applicable, include the deadline for the task]
            
            Example:
            Title: Develop Feature XYZ
            Description: Implement new functionality according to specifications.
            To-Do Status: In Progress
            Medium: Chat
            Deadline: [Optional]
            
            Once you've provided the required details, the chatbot will create a task for you. Make sure to include all relevant information for effective task management.
            ` 
            },
            {
             role: "user",
             content: "Create a new task for project management. Provide the following details: Email Brian about his Github credentials."   
            }
        ],
        model: 'gpt-3.5-turbo',
    });

    return chatCompletion;
}
