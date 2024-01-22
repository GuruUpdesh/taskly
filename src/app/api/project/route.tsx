import { type NewProject, insertProjectSchema } from "~/server/db/schema";
import { createProject } from "~/actions/project-actions";

export async function POST(req: Request) {
	const validation = insertProjectSchema.safeParse(await req.json());
	if (!validation.success) {
		return new Response("Missing parameters", { status: 400 });
	}

	const body = validation.data;

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
