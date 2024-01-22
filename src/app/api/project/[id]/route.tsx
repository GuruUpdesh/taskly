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

// export default function handler(req: NextApiRequest, res: NextApiResponse) {
// 	const { id } = req.query;

// 	console.log(req.method);

// 	switch (req.method) {
// 		case "GET":
// 			// Handle the GET request - Get a single project by ID
// 			res.status(200).json({ message: `Project ${id}` });
// 			break;
// 		case "PUT":
// 			// Handle the PUT request - Update a project
// 			res.status(200).json({ message: `Project ${id} updated` });
// 			break;
// 		case "DELETE":
// 			// Handle the DELETE request - Delete a project
// 			res.status(200).json({ message: `Project ${id} deleted` });
// 			break;
// 		default:
// 			res.setHeader("Allow", ["GET", "PUT", "DELETE"]);
// 			res.status(405).end(`Method ${req.method} Not Allowed`);
// 	}
// }
