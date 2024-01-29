import { type NewTask, insertTaskSchema } from "~/server/db/schema";
import { createTask } from "~/actions/task-actions";

export async function POST(req: Request) {
	const validation = insertTaskSchema.safeParse(await req.json());
	if (!validation.success) {
		return new Response("Missing parameters", { status: 400 });
	}

	const body = validation.data;

	if (
		!body.description ||
		!body.status ||
		!body.projectId ||
		!body.priority ||
		!body.type ||
		!body.title
	) {
		return new Response("Missing parameters", { status: 400 });
	}

	const taskToUpdate: NewTask = {
		title: body.title,
		description: body.description,
		status: body.status,
		projectId: body.projectId,
		priority: body.priority,
		type: body.type,
	};

	const task = await createTask(taskToUpdate);

	return new Response(JSON.stringify(task), {
		headers: { "content-type": "application/json" },
	});
}
