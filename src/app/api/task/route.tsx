import { type NewTask, insertTaskSchema__required } from "~/server/db/schema";
import { createTask } from "~/actions/task-actions";

export async function POST(req: Request) {
	const validation = insertTaskSchema__required.safeParse(await req.json());
	if (!validation.success) {
		return new Response("Missing parameters", { status: 400 });
	}

	const body = validation.data;

	const taskToUpdate: NewTask = {
		title: body.title,
		description: body.description,
		status: body.status,
		projectId: body.projectId,
		priority: body.priority,
		type: body.type,
		assignee: body.assignee,
		backlogOrder: body.backlogOrder,
		boardOrder: body.boardOrder,
	};

	const task = await createTask(taskToUpdate);

	return new Response(JSON.stringify(task), {
		headers: { "content-type": "application/json" },
	});
}
