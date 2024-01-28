import { deleteTask, getTask, updateTask } from "~/actions/task-actions";
import { type NewTask, insertTaskSchema } from "~/server/db/schema";

interface Context {
	params: {
		id: string;
	};
}

export async function POST(req: Request, context: Context) {
	const { params } = context;

	// validator

	const validation = insertTaskSchema.safeParse(await req.json());
	if (!validation.success) {
		return new Response("Missing parameters", { status: 400 });
	}

	const body = validation.data;

	const { id } = params;

	if (
		!body.id ||
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
