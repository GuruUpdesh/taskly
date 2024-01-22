import { NewProject } from "~/server/db/schema";
import { createProject, updateProject } from "~/actions/project-actions";

export async function POST(req: Request) {
	const body = await req.json();

	if (!body.name) {
		return new Response("Missing parameters", { status: 400 });
	}

	const name = body.name;

	const projectToUpdate: NewProject = {
		name,
	};

	const project = await createProject(projectToUpdate);

	return new Response(JSON.stringify(project), {
		headers: { "content-type": "application/json" },
	});
}
