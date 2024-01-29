import { deleteTask, getTask, updateTask } from "~/actions/task-actions";
import { type NewTask, insertTaskSchema__required } from "~/server/db/schema";

interface Context {
	params: {
		id: string;
	};
}

export async function POST(req: Request, context: Context) {
	const { params } = context;

	// validator

	const validation = insertTaskSchema__required.safeParse(await req.json());
	if (!validation.success) {
		return new Response("Missing parameters", { status: 400 });
	}

	const body = validation.data;

	const { id } = params;

	const taskToUpdate: NewTask = {
		title: body.title,
		description: body.description,
		status: body.status,
		projectId: body.projectId,
		priority: body.priority,
		type: body.type,
		assignee: body.assignee,
	};

	const task = await updateTask(parseInt(id), taskToUpdate);

	return new Response(JSON.stringify(task));
}

export async function GET(req: Request, context: Context) {
	const { params } = context;

	const { id } = params;

	const task = await getTask(parseInt(id));

	return new Response(JSON.stringify(task));
}

export async function DELETE(req: Request, context: Context) {
	const { params } = context;

	const { id } = params;

	const task = await deleteTask(parseInt(id));

	return new Response(JSON.stringify(task));
}
