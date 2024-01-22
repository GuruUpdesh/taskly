// pages/api/project/[id].ts

import {
	deleteProject,
	getProject,
	updateProject,
} from "~/actions/project-actions";
import { NewProject } from "~/server/db/schema";

export async function POST(req: Request, context: any) {
	const { params } = context;

	const body = await req.json();

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

	return new Response(JSON.stringify(project), {
		headers: { "content-type": "application/json" },
	});
}

export async function GET(req: Request, context: any) {
	const { params } = context;

	const { id } = params;

	const project = await getProject(parseInt(id));

	return new Response(JSON.stringify(project), {
		headers: { "content-type": "application/json" },
	});
}

export async function DELETE(req: Request, context: any) {
	const { params } = context;

	const { id } = params;

	const project = await deleteProject(parseInt(id));

	return new Response(JSON.stringify(project), {
		headers: { "content-type": "application/json" },
	});
}
