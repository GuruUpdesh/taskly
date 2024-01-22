// pages/api/project/[id].ts

import {
	deleteProject,
	getProject,
	updateProject,
} from "~/actions/project-actions";
import { type NewProject, insertProjectSchema } from "~/server/db/schema";

interface Context {
	params: {
		id: string;
	};
}

export async function POST(req: Request, context: Context) {
	const { params } = context;

	// validator

	const validation = insertProjectSchema.safeParse(await req.json());
	if (!validation.success) {
		return new Response("Missing parameters", { status: 400 });
	}

	const body = validation.data;

	if (!params.id || !body.name) {
		return new Response("Missing parameters", { status: 400 });
	}

	const { id } = params;

	const name = body.name;

	const projectToUpdate: NewProject = {
		name,
		id: parseInt(id),
	};

	const project = await updateProject(parseInt(id), projectToUpdate);

	return new Response(JSON.stringify(project));
}

export async function GET(req: Request, context: Context) {
	const { params } = context;

	const { id } = params;

	const project = await getProject(parseInt(id));

	return new Response(JSON.stringify(project));
}

export async function DELETE(req: Request, context: Context) {
	const { params } = context;

	const { id } = params;

	const project = await deleteProject(parseInt(id));

	return new Response(JSON.stringify(project));
}
